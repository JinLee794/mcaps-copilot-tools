<#
.SYNOPSIS
    Create an Outlook draft email via COM automation.
.DESCRIPTION
    Creates a new mail item in the user's Outlook Drafts folder using COM.
    Supports HTML body, multiple TO/CC/BCC recipients.
    Does NOT send — only saves as draft for human review.
    Requires Outlook desktop to be running.
.PARAMETER To
    Array of recipient email addresses (TO field).
.PARAMETER Cc
    Array of CC recipient email addresses.
.PARAMETER Bcc
    Array of BCC recipient email addresses.
.PARAMETER Subject
    Email subject line.
.PARAMETER Body
    Email body content (HTML). Either Body or BodyFile is required.
.PARAMETER BodyFile
    Path to a file containing the email body. Used instead of -Body for long content.
.PARAMETER BodyType
    Body format: "HTML" (default) or "Text".
.PARAMETER OutputPath
    Optional file path to write JSON result (otherwise writes to stdout).
.EXAMPLE
    .\New-OutlookDraft.ps1 -To "alice@microsoft.com","bob@github.com" -Cc "manager@microsoft.com" -Subject "Hello" -Body "<p>Hi team</p>"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string[]]$To,

    [string[]]$Cc = @(),

    [string[]]$Bcc = @(),

    [Parameter(Mandatory)]
    [string]$Subject,

    [string]$Body = "",

    [string]$BodyFile = "",

    [ValidateSet("HTML", "Text")]
    [string]$BodyType = "HTML",

    [string]$OutputPath = ""
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
} catch {
    Write-Error "Cannot connect to Outlook COM. Ensure Outlook is running: $_"
    exit 1
}

# --- Resolve body from file if needed ---
if ($BodyFile -and (Test-Path $BodyFile)) {
    $Body = Get-Content -Path $BodyFile -Raw -Encoding utf8
}
if (-not $Body) {
    Write-Error "Either -Body or -BodyFile must be provided."
    exit 1
}

# --- Create mail item (olMailItem = 0) ---
try {
    $mail = $outlook.CreateItem(0)

    # Set recipients
    $mail.To  = ($To -join "; ")
    if ($Cc.Count -gt 0)  { $mail.CC  = ($Cc -join "; ") }
    if ($Bcc.Count -gt 0) { $mail.BCC = ($Bcc -join "; ") }

    # Set subject
    $mail.Subject = $Subject

    # Set body
    if ($BodyType -eq "HTML") {
        $mail.HTMLBody = $Body
    } else {
        $mail.Body = $Body
    }

    # Save as draft (do NOT send)
    $mail.Save()

    $entryId  = $mail.EntryID
    $createdOn = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")

    $result = [PSCustomObject]@{
        status    = "draft_created"
        entryId   = $entryId
        subject   = $Subject
        to        = ($To -join "; ")
        cc        = ($Cc -join "; ")
        bcc       = ($Bcc -join "; ")
        bodyType  = $BodyType
        createdOn = $createdOn
        message   = "Draft saved to Outlook Drafts folder. Open Outlook to review and send."
    }

    $json = $result | ConvertTo-Json -Depth 4

    if ($OutputPath) {
        $json | Out-File -FilePath $OutputPath -Encoding utf8
        Write-Host "Draft created. Result written to: $OutputPath" -ForegroundColor Green
    } else {
        Write-Output $json
    }

} catch {
    $errorResult = [PSCustomObject]@{
        status  = "error"
        message = "Failed to create draft: $_"
    }
    $errorResult | ConvertTo-Json | Write-Error
    exit 1
} finally {
    # Release COM objects
    if ($null -ne $mail) { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($mail) | Out-Null }
}
