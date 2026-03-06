<#
.SYNOPSIS
    Get the N most recent emails from Outlook Inbox and/or Sent Items.
.DESCRIPTION
    Retrieves recent emails via COM automation without requiring contact filtering.
    Returns structured JSON with message metadata for agent consumption.
    Requires Outlook desktop to be running.
.PARAMETER MaxResults
    Maximum number of emails to return (default: 10, max: 100).
.PARAMETER DaysBack
    Number of days to look back (default: 7).
.PARAMETER Folders
    Which folders to search: Inbox, SentItems, or Both (default: Both).
.PARAMETER Keywords
    Optional array of keywords to filter by subject match.
.PARAMETER OutputPath
    File path to write JSON results.
.EXAMPLE
    .\Get-RecentOutlookEmails.ps1 -MaxResults 5 -DaysBack 3 -OutputPath out.json
#>
[CmdletBinding()]
param(
    [int]$MaxResults = 10,

    [int]$DaysBack = 7,

    [ValidateSet("Inbox", "SentItems", "Both")]
    [string]$Folders = "Both",

    [string[]]$Keywords = @(),

    [Parameter(Mandatory)]
    [string]$OutputPath
)

$ErrorActionPreference = "Stop"

# Clamp MaxResults
if ($MaxResults -lt 1) { $MaxResults = 1 }
if ($MaxResults -gt 100) { $MaxResults = 100 }

# --- Ensure Outlook is running ---
$outlookProcess = Get-Process -Name "OUTLOOK" -ErrorAction SilentlyContinue
if (-not $outlookProcess) {
    $errResult = @{ error = "Outlook is not running"; messages = @() }
    $errResult | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputPath -Encoding utf8
    exit 1
}

try {
    $outlook = New-Object -ComObject Outlook.Application
} catch {
    $errResult = @{ error = "Cannot connect to Outlook COM: $_"; messages = @() }
    $errResult | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputPath -Encoding utf8
    exit 1
}

$ns = $outlook.GetNamespace("MAPI")
$cutoffDASL = (Get-Date).AddDays(-$DaysBack).ToString("MM/dd/yyyy HH:mm")

function Get-RecentFromFolder {
    param(
        [object]$Folder,
        [string]$FolderName,
        [string]$CutoffDASL,
        [int]$Limit,
        [string[]]$Keywords
    )

    $results = @()
    try {
        $items = $Folder.Items
        $items.Sort("[ReceivedTime]", $true)  # descending — newest first

        $dateFilter = "[ReceivedTime] >= '$CutoffDASL'"
        $filtered = $items.Restrict($dateFilter)

        $count = 0
        foreach ($item in $filtered) {
            if ($count -ge $Limit) { break }
            if ($null -eq $item -or $null -eq $item.Class) { continue }
            # olMail=43, olMeetingRequest=53, olMeetingCancellation=54
            if ($item.Class -ne 43 -and $item.Class -ne 53 -and $item.Class -ne 54) { continue }

            # Keyword filter (optional)
            if ($Keywords.Count -gt 0) {
                $subj = $item.Subject
                if (-not $subj) { continue }
                $subjLower = $subj.ToLower()
                $kwMatch = $false
                foreach ($kw in $Keywords) {
                    if ($subjLower.Contains($kw.ToLower())) { $kwMatch = $true; break }
                }
                if (-not $kwMatch) { continue }
            }

            # Extract sender
            $senderDisplay = ""
            try {
                $senderAddr = $item.SenderEmailAddress
                if ($senderAddr -and $senderAddr.Contains("/")) {
                    try {
                        $senderAddr = $item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
                    } catch { }
                }
                $senderDisplay = "$($item.SenderName) <$senderAddr>"
            } catch { }

            # Extract recipients
            $toList = @()
            $ccList = @()
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
                    $entry = if ($addr) { "$name <$addr>" } else { $name }
                    if ($recip.Type -eq 1) { $toList += $entry }
                    elseif ($recip.Type -eq 2) { $ccList += $entry }
                }
            } catch { }

            # Extract plain-text body (truncate to 4000 chars)
            $bodyText = ""
            try { $bodyText = $item.Body } catch { }
            if ($bodyText.Length -gt 4000) { $bodyText = $bodyText.Substring(0, 4000) + "`n[...truncated at 4000 chars]" }

            $results += [PSCustomObject]@{
                Subject      = $item.Subject
                SentOn       = $item.SentOn.ToString("yyyy-MM-ddTHH:mm:ss")
                ReceivedTime = $item.ReceivedTime.ToString("yyyy-MM-ddTHH:mm:ss")
                From         = $senderDisplay
                To           = ($toList -join "; ")
                Cc           = ($ccList -join "; ")
                Folder       = $FolderName
                ConvTopic    = $item.ConversationTopic
                Body         = $bodyText
            }
            $count++
        }
    } catch {
        Write-Warning "Error reading $FolderName : $_"
    }

    return $results
}

# --- Collect from requested folders ---
$allResults = @()

if ($Folders -eq "Inbox" -or $Folders -eq "Both") {
    $inboxFolder = $ns.GetDefaultFolder(6)
    $inboxHits = Get-RecentFromFolder -Folder $inboxFolder -FolderName "Inbox" -CutoffDASL $cutoffDASL -Limit $MaxResults -Keywords $Keywords
    Write-Host "  Inbox: $($inboxHits.Count) messages" -ForegroundColor Gray
    $allResults += $inboxHits
}

if ($Folders -eq "SentItems" -or $Folders -eq "Both") {
    $sentFolder = $ns.GetDefaultFolder(5)
    $sentHits = Get-RecentFromFolder -Folder $sentFolder -FolderName "SentItems" -CutoffDASL $cutoffDASL -Limit $MaxResults -Keywords $Keywords
    Write-Host "  SentItems: $($sentHits.Count) messages" -ForegroundColor Gray
    $allResults += $sentHits
}

# --- Sort combined results by ReceivedTime descending and trim to MaxResults ---
$allResults = $allResults | Sort-Object -Property ReceivedTime -Descending | Select-Object -First $MaxResults

# --- Build output ---
$output = @{
    query      = @{
        maxResults = $MaxResults
        daysBack   = $DaysBack
        folders    = $Folders
        keywords   = $Keywords
    }
    totalFound = $allResults.Count
    messages   = @($allResults)
}

$output | ConvertTo-Json -Depth 10 | Out-File -FilePath $OutputPath -Encoding utf8
Write-Host "Done. $($allResults.Count) messages written to $OutputPath" -ForegroundColor Green
