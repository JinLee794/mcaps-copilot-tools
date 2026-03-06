<#
.SYNOPSIS
    Search Outlook calendar via COM automation for meeting/event lookups.
.DESCRIPTION
    Searches the default Calendar folder by date range, keywords, and attendees.
    Returns structured JSON with event metadata for agent consumption.
    Requires Outlook desktop to be running.
.PARAMETER DaysBack
    Number of days to look back for past events (default: 14).
.PARAMETER DaysForward
    Number of days to look forward for future events (default: 14).
.PARAMETER Keywords
    Optional array of keywords to match in Subject.
.PARAMETER Attendees
    Optional array of attendee email addresses to filter by.
.PARAMETER AccountName
    Optional account name for labeling output.
.PARAMETER MaxResults
    Maximum number of events to return (default: 50).
.PARAMETER OutputPath
    File path to write JSON results.
.EXAMPLE
    .\Search-OutlookCalendar.ps1 -DaysBack 30 -DaysForward 14 -Keywords "Contoso","GHCP" -OutputPath out.json
#>
[CmdletBinding()]
param(
    [int]$DaysBack = 14,

    [int]$DaysForward = 14,

    [string[]]$Keywords = @(),

    [string[]]$Attendees = @(),

    [string]$AccountName = "",

    [int]$MaxResults = 50,

    [Parameter(Mandatory)]
    [string]$OutputPath
)

$ErrorActionPreference = "Stop"

# --- Ensure Outlook is running ---
$outlookProcess = Get-Process -Name "OUTLOOK" -ErrorAction SilentlyContinue
if (-not $outlookProcess) {
    Write-Error "Outlook is not running. Please start Outlook and try again."
    exit 1
}

try {
    $outlook = New-Object -ComObject Outlook.Application
    $ns = $outlook.GetNamespace("MAPI")
} catch {
    Write-Error "Failed to connect to Outlook COM: $_"
    exit 1
}

# --- Access Calendar folder (olFolderCalendar = 9) ---
try {
    $calFolder = $ns.GetDefaultFolder(9)
} catch {
    Write-Error "Failed to access Calendar folder: $_"
    exit 1
}

$startDate = (Get-Date).AddDays(-$DaysBack).ToString("MM/dd/yyyy 00:00")
$endDate = (Get-Date).AddDays($DaysForward).ToString("MM/dd/yyyy 23:59")

Write-Host "Calendar search: $startDate to $endDate" -ForegroundColor Cyan
if ($Keywords.Count -gt 0) { Write-Host "  Keywords: $($Keywords -join ', ')" -ForegroundColor Gray }
if ($Attendees.Count -gt 0) { Write-Host "  Attendees: $($Attendees -join ', ')" -ForegroundColor Gray }

# --- Get calendar items with IncludeRecurrences for recurring event expansion ---
$items = $calFolder.Items
$items.Sort("[Start]", $false)
$items.IncludeRecurrences = $true

# Restrict to date range
$filter = "[Start] >= '$startDate' AND [End] <= '$endDate'"
$filtered = $items.Restrict($filter)

$results = @()
$count = 0

foreach ($item in $filtered) {
    if ($null -eq $item) { continue }
    # Only process appointment items (Class 26 = olAppointment)
    if ($item.Class -ne 26) { continue }
    if ($count -ge $MaxResults) { break }

    # --- Keyword filter (if specified) ---
    if ($Keywords.Count -gt 0) {
        $subj = $item.Subject; if (-not $subj) { $subj = "" }
        $subjLower = $subj.ToLower()
        $kwMatch = $false
        foreach ($kw in $Keywords) {
            if ($subjLower.Contains($kw.ToLower())) { $kwMatch = $true; break }
        }
        if (-not $kwMatch) { continue }
    }

    # --- Extract attendees ---
    $requiredAttendees = @()
    $optionalAttendees = @()
    try {
        for ($r = 1; $r -le $item.Recipients.Count; $r++) {
            $recip = $item.Recipients.Item($r)
            $addr = ""
            try {
                $addr = $recip.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x39FE001F")
            } catch {
                $addr = $recip.Address
            }
            $name = $recip.Name
            $status = switch ($recip.MeetingResponseStatus) {
                0 { "None" }
                1 { "Organized" }
                2 { "Tentative" }
                3 { "Accepted" }
                4 { "Declined" }
                default { "Unknown" }
            }
            $entry = [PSCustomObject]@{
                Name   = $name
                Email  = $addr
                Status = $status
            }
            if ($recip.Type -eq 1) { $requiredAttendees += $entry }      # olRequired
            elseif ($recip.Type -eq 2) { $optionalAttendees += $entry }  # olOptional
        }
    } catch { }

    # --- Attendee filter (if specified) ---
    if ($Attendees.Count -gt 0) {
        $attendeeMatch = $false
        $allAttendeeEmails = ($requiredAttendees + $optionalAttendees) | ForEach-Object { $_.Email.ToLower() }
        foreach ($filterAttendee in $Attendees) {
            $filterLower = $filterAttendee.ToLower()
            foreach ($ae in $allAttendeeEmails) {
                if ($ae -and $ae.Contains($filterLower)) { $attendeeMatch = $true; break }
            }
            if ($attendeeMatch) { break }
        }
        if (-not $attendeeMatch) { continue }
    }

    # --- Extract organizer ---
    $organizer = ""
    try { $organizer = $item.Organizer } catch { }

    # --- Extract location ---
    $location = ""
    try { $location = $item.Location } catch { }

    # --- Extract body preview (truncated) ---
    $bodyPreview = ""
    try {
        $bodyPreview = $item.Body
        if ($bodyPreview.Length -gt 1500) {
            $bodyPreview = $bodyPreview.Substring(0, 1500) + "`n[...truncated]"
        }
    } catch { }

    # --- Determine meeting status ---
    $busyStatus = switch ($item.BusyStatus) {
        0 { "Free" }
        1 { "Tentative" }
        2 { "Busy" }
        3 { "OutOfOffice" }
        4 { "WorkingElsewhere" }
        default { "Unknown" }
    }

    $isRecurring = $false
    try { $isRecurring = $item.IsRecurring } catch { }

    $categories = ""
    try { $categories = $item.Categories } catch { }

    $results += [PSCustomObject]@{
        Subject           = $item.Subject
        Start             = $item.Start.ToString("yyyy-MM-ddTHH:mm:ss")
        End               = $item.End.ToString("yyyy-MM-ddTHH:mm:ss")
        Duration          = $item.Duration
        Location          = $location
        Organizer         = $organizer
        BusyStatus        = $busyStatus
        IsRecurring       = $isRecurring
        Categories        = $categories
        RequiredAttendees = $requiredAttendees
        OptionalAttendees = $optionalAttendees
        BodyPreview       = $bodyPreview
    }
    $count++
}

Write-Host "Found $($results.Count) calendar events." -ForegroundColor Green

# --- Build output ---
$output = [PSCustomObject]@{
    searchParams = [PSCustomObject]@{
        daysBack    = $DaysBack
        daysForward = $DaysForward
        keywords    = $Keywords
        attendees   = $Attendees
        accountName = $AccountName
        maxResults  = $MaxResults
        startDate   = $startDate
        endDate     = $endDate
    }
    totalFound   = $results.Count
    events       = $results
}

$json = $output | ConvertTo-Json -Depth 5 -Compress
[System.IO.File]::WriteAllText($OutputPath, $json, [System.Text.Encoding]::UTF8)

Write-Host "Results written to: $OutputPath" -ForegroundColor Green
