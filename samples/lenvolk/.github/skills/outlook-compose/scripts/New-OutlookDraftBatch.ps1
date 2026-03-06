<#
.SYNOPSIS
    Batch create Outlook draft emails for multiple accounts in a single COM session.
.DESCRIPTION
    Reads a JSON input file with an array of draft specs. Initializes Outlook COM
    once, loops all drafts, and writes a single JSON output file keyed by account
    name. Per-account errors are captured in _errors without halting the batch.
    Designed for fleet operations (4+ accounts).
.PARAMETER InputPath
    Path to the JSON input file. Expected schema:
    [
      { "account": "COX", "to": ["a@cox.com"], "cc": ["b@ms.com"], "subject": "...", "body": "<p>...</p>", "bodyType": "HTML" },
      { "account": "NIELSEN", "to": ["b@nielseniq.com"], "subject": "...", "body": "<p>...</p>" }
    ]
.PARAMETER OutputPath
    Path to write the JSON results file.
.EXAMPLE
    .\New-OutlookDraftBatch.ps1 -InputPath ".tmp_draft_batch_input_a3f21c.json" -OutputPath ".tmp_draft_batch_results_a3f21c.json"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$InputPath,

    [Parameter(Mandatory)]
    [string]$OutputPath
)

$ErrorActionPreference = "Stop"

# --- Validate input file ---
if (-not (Test-Path $InputPath)) {
    Write-Error "Input file not found: $InputPath"
    exit 1
}

$inputJson = Get-Content $InputPath -Raw -Encoding UTF8
$drafts = $inputJson | ConvertFrom-Json

if (-not $drafts -or $drafts.Count -eq 0) {
    Write-Error "Input file contains no draft specs."
    exit 1
}

# --- Ensure Outlook is running ---
$outlookProcess = Get-Process -Name "OUTLOOK" -ErrorAction SilentlyContinue
if (-not $outlookProcess) {
    Write-Error "Outlook is not running. Please start Outlook and try again."
    exit 1
}

# --- Initialize COM once ---
try {
    $outlook = New-Object -ComObject Outlook.Application
} catch {
    Write-Error "Cannot connect to Outlook COM. Ensure Outlook is running: $_"
    exit 1
}

$startedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
$results = @{}
$errors = @{}
$draftsCreated = 0
$draftsFailed = 0

# --- Process each draft ---
foreach ($spec in $drafts) {
    $acctName = $spec.account
    $toAddrs = @($spec.to)
    $ccAddrs = if ($spec.cc) { @($spec.cc) } else { @() }
    $bccAddrs = if ($spec.bcc) { @($spec.bcc) } else { @() }
    $subject = $spec.subject
    $body = $spec.body
    $bodyType = if ($spec.bodyType) { $spec.bodyType } else { "HTML" }

    Write-Host "[$acctName] Creating draft..." -ForegroundColor Cyan

    $mail = $null
    try {
        # Validate required fields
        if (-not $toAddrs -or $toAddrs.Count -eq 0) { throw "Missing 'to' recipients" }
        if (-not $subject) { throw "Missing 'subject'" }
        if (-not $body) { throw "Missing 'body'" }

        $mail = $outlook.CreateItem(0)  # olMailItem

        $mail.To = ($toAddrs -join "; ")
        if ($ccAddrs.Count -gt 0)  { $mail.CC  = ($ccAddrs -join "; ") }
        if ($bccAddrs.Count -gt 0) { $mail.BCC = ($bccAddrs -join "; ") }

        $mail.Subject = $subject

        if ($bodyType -eq "HTML") {
            $mail.HTMLBody = $body
        } else {
            $mail.Body = $body
        }

        $mail.Save()

        $results[$acctName] = [PSCustomObject]@{
            status    = "draft_created"
            entryId   = $mail.EntryID
            subject   = $subject
            to        = ($toAddrs -join "; ")
            cc        = ($ccAddrs -join "; ")
            bcc       = ($bccAddrs -join "; ")
            bodyType  = $bodyType
            createdOn = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        }

        $draftsCreated++
        Write-Host "[$acctName] Draft created" -ForegroundColor Green

    } catch {
        $errors[$acctName] = $_.ToString()
        $draftsFailed++
        Write-Warning "[$acctName] FAILED: $_"
    } finally {
        if ($null -ne $mail) {
            try { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($mail) | Out-Null } catch { }
        }
    }
}

# --- Build final output ---
$completedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
$results["_meta"] = [PSCustomObject]@{
    startedAt      = $startedAt
    completedAt    = $completedAt
    draftsCreated  = $draftsCreated
    draftsFailed   = $draftsFailed
    totalDrafts    = $drafts.Count
}
if ($errors.Count -gt 0) {
    $results["_errors"] = [PSCustomObject]$errors
}

$json = $results | ConvertTo-Json -Depth 6
$json | Set-Content -Path $OutputPath -Encoding UTF8

Write-Host "`n--- Batch Complete ---" -ForegroundColor Yellow
Write-Host "Created: $draftsCreated / $($drafts.Count)"
if ($draftsFailed -gt 0) {
    Write-Host "Failed:  $draftsFailed" -ForegroundColor Red
}
Write-Host "Output:  $OutputPath"
