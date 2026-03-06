<#
.SYNOPSIS
    Batch search Outlook mailbox for multiple accounts in a single COM session.
.DESCRIPTION
    Reads a JSON input file with an array of account search specs. Initializes
    Outlook COM once, loops all accounts, and writes a single JSON output file
    keyed by account name. Per-account errors are captured in _errors without
    halting the batch. Designed for fleet operations (4+ accounts).
.PARAMETER InputPath
    Path to the JSON input file. Expected schema:
    [
      { "account": "COX", "contacts": ["a@cox.com"], "keywords": ["GHAS"], "daysBack": 90 },
      { "account": "NIELSEN", "contacts": ["b@nielseniq.com"], "keywords": ["GHCP"], "daysBack": 90 }
    ]
.PARAMETER OutputPath
    Path to write the JSON results file.
.EXAMPLE
    .\Search-OutlookEmailBatch.ps1 -InputPath ".tmp_email_batch_input_a3f21c.json" -OutputPath ".tmp_email_batch_results_a3f21c.json"
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
$accounts = $inputJson | ConvertFrom-Json

if (-not $accounts -or $accounts.Count -eq 0) {
    Write-Error "Input file contains no account search specs."
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

$ns = $outlook.GetNamespace("MAPI")
$sentFolder = $ns.GetDefaultFolder(5)   # olFolderSentMail
$inboxFolder = $ns.GetDefaultFolder(6)  # olFolderInbox

$startedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
$results = @{}
$errors = @{}
$accountsProcessed = 0
$accountsFailed = 0

# --- Helper: extract message metadata ---
function Get-MessageMeta {
    param([object]$Item, [string]$FolderName, [string]$MatchContact)

    $toList = @()
    $ccList = @()
    try {
        for ($r = 1; $r -le $Item.Recipients.Count; $r++) {
            $recip = $Item.Recipients.Item($r)
            $addr = ""
            try { $addr = $recip.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x39FE001F") } catch { $addr = $recip.Address }
            $name = $recip.Name
            $entry = if ($addr) { "$name <$addr>" } else { $name }
            if ($recip.Type -eq 1) { $toList += $entry }
            elseif ($recip.Type -eq 2) { $ccList += $entry }
        }
    } catch { }

    $senderDisplay = ""
    try { $senderDisplay = "$($Item.SenderName) <$($Item.SenderEmailAddress)>" } catch { }

    return [PSCustomObject]@{
        Subject      = $Item.Subject
        SentOn       = $Item.SentOn.ToString("yyyy-MM-ddTHH:mm:ss")
        ReceivedTime = $Item.ReceivedTime.ToString("yyyy-MM-ddTHH:mm:ss")
        From         = $senderDisplay
        To           = ($toList -join "; ")
        Cc           = ($ccList -join "; ")
        Folder       = $FolderName
        MatchContact = $MatchContact
        ConvTopic    = $Item.ConversationTopic
    }
}

# --- Helper: resolve sender email ---
function Get-SenderEmail {
    param([object]$Item)
    $addr = ""
    try {
        $addr = $Item.SenderEmailAddress
        if ($addr -and $addr.Contains("/")) {
            $addr = $Item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
        }
    } catch { }
    return $addr
}

# --- Helper: check if contact matches a recipient ---
function Test-RecipientMatch {
    param([object]$Item, [string]$ContactLower)
    for ($r = 1; $r -le $Item.Recipients.Count; $r++) {
        $recip = $Item.Recipients.Item($r)
        $addr = ""
        try {
            $addr = $recip.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x39FE001F")
            if ([string]::IsNullOrEmpty($addr)) { $addr = $recip.Address }
        } catch {
            try { $addr = $recip.Address } catch { }
        }
        if ($addr -and $addr.ToLower().Contains($ContactLower)) { return $true }
    }
    return $false
}

# --- Process each account ---
foreach ($acct in $accounts) {
    $acctName = $acct.account
    $contacts = @($acct.contacts)
    $keywords = if ($acct.keywords) { @($acct.keywords) } else { @() }
    $daysBack = if ($acct.daysBack) { $acct.daysBack } else { 30 }

    Write-Host "[$acctName] Processing ($($contacts.Count) contacts, $($keywords.Count) keywords, ${daysBack}d)..." -ForegroundColor Cyan

    # Per-account timeout via background job
    $jobResult = $null
    $timedOut = $false

    try {
        $cutoffDASL = (Get-Date).AddDays(-$daysBack).ToString("MM/dd/yyyy HH:mm")
        $dateFilter = "[ReceivedTime] >= '$cutoffDASL'"
        $allResults = @()

        # --- Contact-based search ---
        foreach ($contact in $contacts) {
            $contactLower = $contact.ToLower()

            # Sent Items: check recipients
            try {
                $sentItems = $sentFolder.Items
                $sentItems.Sort("[ReceivedTime]", $true)
                $sentFiltered = $sentItems.Restrict($dateFilter)
                foreach ($item in $sentFiltered) {
                    if ($null -eq $item -or $item.Class -ne 43) { continue }
                    if (Test-RecipientMatch -Item $item -ContactLower $contactLower) {
                        $allResults += Get-MessageMeta -Item $item -FolderName "SentItems" -MatchContact $contact
                    }
                }
            } catch {
                Write-Warning "[$acctName] Error searching SentItems for $contact : $_"
            }

            # Inbox: check sender
            try {
                $inboxItems = $inboxFolder.Items
                $inboxItems.Sort("[ReceivedTime]", $true)
                $inboxFiltered = $inboxItems.Restrict($dateFilter)
                foreach ($item in $inboxFiltered) {
                    if ($null -eq $item -or $item.Class -ne 43) { continue }
                    $senderAddr = Get-SenderEmail -Item $item
                    if ($senderAddr -and $senderAddr.ToLower().Contains($contactLower)) {
                        $allResults += Get-MessageMeta -Item $item -FolderName "Inbox" -MatchContact $contact
                    }
                }
            } catch {
                Write-Warning "[$acctName] Error searching Inbox for $contact : $_"
            }
        }

        # --- Keyword search ---
        if ($keywords.Count -gt 0) {
            foreach ($folder in @(@{F=$sentFolder;N="SentItems"}, @{F=$inboxFolder;N="Inbox"})) {
                try {
                    $items = $folder.F.Items
                    $items.Sort("[ReceivedTime]", $true)
                    $filtered = $items.Restrict($dateFilter)

                    foreach ($item in $filtered) {
                        if ($null -eq $item -or $item.Class -ne 43) { continue }
                        $subj = $item.Subject
                        if (-not $subj) { continue }

                        $subjLower = $subj.ToLower()
                        $kwMatch = $false
                        foreach ($kw in $keywords) {
                            if ($subjLower.Contains($kw.ToLower())) { $kwMatch = $true; break }
                        }
                        if (-not $kwMatch) { continue }

                        # Dedup check
                        $sentStr = $item.SentOn.ToString("yyyy-MM-ddTHH:mm:ss")
                        $isDupe = $allResults | Where-Object { $_.Subject -eq $subj -and $_.SentOn -eq $sentStr }
                        if ($isDupe) { continue }

                        # Account scoping: keyword hits must involve a known contact or mention account name
                        if ($contacts.Count -gt 0) {
                            $contactInvolved = $false

                            $kwSender = Get-SenderEmail -Item $item
                            if ($kwSender) {
                                $kwSenderLower = $kwSender.ToLower()
                                foreach ($c in $contacts) {
                                    if ($kwSenderLower.Contains($c.ToLower())) { $contactInvolved = $true; break }
                                }
                            }

                            if (-not $contactInvolved) {
                                foreach ($c in $contacts) {
                                    if (Test-RecipientMatch -Item $item -ContactLower $c.ToLower()) {
                                        $contactInvolved = $true; break
                                    }
                                }
                            }

                            if (-not $contactInvolved -and $acctName -and $subjLower.Contains($acctName.ToLower())) {
                                $contactInvolved = $true
                            }

                            if (-not $contactInvolved) { continue }
                        }

                        $allResults += Get-MessageMeta -Item $item -FolderName $folder.N -MatchContact "keyword:$($keywords -join ',')"
                    }
                } catch {
                    Write-Warning "[$acctName] Error in keyword search ($($folder.N)): $_"
                }
            }
        }

        # --- Deduplicate ---
        $deduped = $allResults | Sort-Object Subject, SentOn -Unique | Sort-Object SentOn -Descending

        # --- Analyze: flag unanswered sent items ---
        $sentMessages = @($deduped | Where-Object { $_.Folder -eq "SentItems" })
        $inboxMessages = @($deduped | Where-Object { $_.Folder -eq "Inbox" })

        $analysis = @()
        foreach ($sent in $sentMessages) {
            $convTopic = $sent.ConvTopic
            $sentTime = [datetime]::Parse($sent.SentOn)
            $replies = $inboxMessages | Where-Object {
                $_.ConvTopic -eq $convTopic -and [datetime]::Parse($_.ReceivedTime) -gt $sentTime
            }
            $elapsed = (Get-Date) - $sentTime
            $analysis += [PSCustomObject]@{
                Subject     = $sent.Subject
                SentOn      = $sent.SentOn
                To          = $sent.To
                Cc          = $sent.Cc
                ConvTopic   = $convTopic
                HasReply    = ($replies.Count -gt 0)
                LatestReply = if ($replies.Count -gt 0) { ($replies | Sort-Object ReceivedTime -Descending | Select-Object -First 1).ReceivedTime } else { $null }
                ReplyFrom   = if ($replies.Count -gt 0) { ($replies | Sort-Object ReceivedTime -Descending | Select-Object -First 1).From } else { $null }
                DaysWaiting = [math]::Round($elapsed.TotalDays, 1)
                Status      = if ($replies.Count -gt 0) { "REPLIED" } else { "NO_RESPONSE" }
            }
        }

        $results[$acctName] = [PSCustomObject]@{
            account       = $acctName
            searchDate    = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
            daysBack      = $daysBack
            contacts      = $contacts
            keywords      = $keywords
            totalMessages = $deduped.Count
            sentCount     = $sentMessages.Count
            inboxCount    = $inboxMessages.Count
            flaggedCount  = ($analysis | Where-Object { $_.Status -eq "NO_RESPONSE" }).Count
            messages      = $deduped
            analysis      = $analysis
        }

        $accountsProcessed++
        $noReply = ($analysis | Where-Object { $_.Status -eq "NO_RESPONSE" }).Count
        Write-Host "[$acctName] Done: $($deduped.Count) msgs ($($sentMessages.Count) sent, $($inboxMessages.Count) inbox), $noReply flagged" -ForegroundColor Green

    } catch {
        $errors[$acctName] = $_.ToString()
        $accountsFailed++
        Write-Warning "[$acctName] FAILED: $_"
    }
}

# --- Build final output ---
$completedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
$results["_meta"] = [PSCustomObject]@{
    startedAt         = $startedAt
    completedAt       = $completedAt
    accountsProcessed = $accountsProcessed
    accountsFailed    = $accountsFailed
    totalAccounts     = $accounts.Count
}
if ($errors.Count -gt 0) {
    $results["_errors"] = [PSCustomObject]$errors
}

$json = $results | ConvertTo-Json -Depth 6
$json | Set-Content -Path $OutputPath -Encoding UTF8

Write-Host "`n--- Batch Complete ---" -ForegroundColor Yellow
Write-Host "Processed: $accountsProcessed / $($accounts.Count)"
if ($accountsFailed -gt 0) {
    Write-Host "Failed:    $accountsFailed" -ForegroundColor Red
}
Write-Host "Output:    $OutputPath"
