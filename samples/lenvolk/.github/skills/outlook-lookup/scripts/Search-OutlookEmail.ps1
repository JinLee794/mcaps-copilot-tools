<#
.SYNOPSIS
    Search Outlook mailbox via COM automation for account email tracking.
.DESCRIPTION
    Searches Sent Items and Inbox by participant email addresses with date filtering.
    Returns structured JSON with message metadata for agent consumption.
    Requires Outlook desktop to be running.
.PARAMETER Contacts
    Array of email addresses to search for.
.PARAMETER DaysBack
    Number of days to look back (default: 30).
.PARAMETER AccountName
    Optional account name for labeling output.
.PARAMETER Keywords
    Optional array of subject-line keywords to search.
.PARAMETER OutputPath
    Optional file path to write JSON results (otherwise writes to stdout).
.EXAMPLE
    .\Search-OutlookEmail.ps1 -Contacts "robfreud@github.com","mojabbar@github.com" -DaysBack 30 -AccountName "MILLENNIUM PARTNERS"
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string[]]$Contacts,

    [int]$DaysBack = 30,

    [string]$AccountName = "",

    [string[]]$Keywords = @(),

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

$ns = $outlook.GetNamespace("MAPI")
$sentFolder   = $ns.GetDefaultFolder(5)  # olFolderSentMail
$inboxFolder  = $ns.GetDefaultFolder(6)  # olFolderInbox

$cutoffDate = (Get-Date).AddDays(-$DaysBack).ToString("MM/dd/yyyy HH:mm")

# --- Helper: search a folder for messages involving a contact ---
function Search-Folder {
    param(
        [object]$Folder,
        [string]$FolderName,
        [string]$ContactEmail,
        [string]$CutoffDASL
    )

    $results = @()

    # DASL filter: search To, CC, and SenderEmailAddress for the contact
    if ($FolderName -eq "SentItems") {
        # For Sent Items: recipient contains the contact
        $filter = "@SQL=urn:schemas:httpmail:datereceived >= '$CutoffDASL' AND (""urn:schemas:httpmail:displayto"" LIKE '%$ContactEmail%' OR ""urn:schemas:httpmail:displaycc"" LIKE '%$ContactEmail%')"
    } else {
        # For Inbox: sender is the contact
        $filter = "@SQL=urn:schemas:httpmail:datereceived >= '$CutoffDASL' AND ""urn:schemas:httpmail:fromemail"" LIKE '%$ContactEmail%'"
    }

    try {
        $items = $Folder.Items
        $items.Sort("[ReceivedTime]", $true)  # descending

        # Use Restrict with a simpler filter for reliability, then post-filter
        $dateFilter = "[ReceivedTime] >= '$CutoffDASL'"
        $filtered = $items.Restrict($dateFilter)

        foreach ($item in $filtered) {
            if ($null -eq $item -or $null -eq $item.Class) { continue }
            # Only process mail items (Class 43 = olMail)
            if ($item.Class -ne 43) { continue }

            $match = $false
            $contactLower = $ContactEmail.ToLower()

            if ($FolderName -eq "SentItems") {
                # Check recipients
                for ($r = 1; $r -le $item.Recipients.Count; $r++) {
                    $recip = $item.Recipients.Item($r)
                    $addr = ""
                    try {
                        $addr = $recip.Address
                        if ([string]::IsNullOrEmpty($addr)) {
                            $addr = $recip.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x39FE001F")
                        }
                    } catch { }
                    if ($addr -and $addr.ToLower().Contains($contactLower)) {
                        $match = $true
                        break
                    }
                }
            } else {
                # Check sender
                $senderAddr = ""
                try {
                    $senderAddr = $item.SenderEmailAddress
                    if ($senderAddr -and $senderAddr.Contains("/")) {
                        # Exchange DN - resolve via PropertyAccessor
                        $senderAddr = $item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
                    }
                } catch { }
                if ($senderAddr -and $senderAddr.ToLower().Contains($contactLower)) {
                    $match = $true
                }
            }

            if ($match) {
                # Extract recipient list
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
                        if ($recip.Type -eq 1) { $toList += $entry }      # olTo
                        elseif ($recip.Type -eq 2) { $ccList += $entry }  # olCC
                    }
                } catch { }

                $senderDisplay = ""
                try { $senderDisplay = "$($item.SenderName) <$($item.SenderEmailAddress)>" } catch { }

                # Extract plain-text body (truncate to 4000 chars to keep payload manageable)
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
                    MatchContact = $ContactEmail
                    ConvTopic    = $item.ConversationTopic
                    Body         = $bodyText
                }
            }
        }
    } catch {
        Write-Warning "Error searching $FolderName for $ContactEmail : $_"
    }

    return $results
}

# --- Main search loop ---
$allResults = @()
$cutoffDASL = (Get-Date).AddDays(-$DaysBack).ToString("MM/dd/yyyy HH:mm")

foreach ($contact in $Contacts) {
    Write-Host "Searching for: $contact ..." -ForegroundColor Cyan

    $sentHits = Search-Folder -Folder $sentFolder -FolderName "SentItems" -ContactEmail $contact -CutoffDASL $cutoffDASL
    Write-Host "  SentItems: $($sentHits.Count) messages" -ForegroundColor Gray
    $allResults += $sentHits

    $inboxHits = Search-Folder -Folder $inboxFolder -FolderName "Inbox" -ContactEmail $contact -CutoffDASL $cutoffDASL
    Write-Host "  Inbox:     $($inboxHits.Count) messages" -ForegroundColor Gray
    $allResults += $inboxHits
}

# --- Keyword search (optional) ---
if ($Keywords.Count -gt 0) {
    Write-Host "Searching by keywords: $($Keywords -join ', ') ..." -ForegroundColor Cyan
    $dateFilter = "[ReceivedTime] >= '$cutoffDASL'"

    foreach ($folder in @(@{F=$sentFolder;N="SentItems"}, @{F=$inboxFolder;N="Inbox"})) {
        $items = $folder.F.Items
        $items.Sort("[ReceivedTime]", $true)
        $filtered = $items.Restrict($dateFilter)

        foreach ($item in $filtered) {
            if ($null -eq $item -or $item.Class -ne 43) { continue }
            $subj = $item.Subject
            if (-not $subj) { continue }

            $subjLower = $subj.ToLower()
            $kwMatch = $false
            foreach ($kw in $Keywords) {
                if ($subjLower.Contains($kw.ToLower())) { $kwMatch = $true; break }
            }
            if (-not $kwMatch) { continue }

            # Avoid duplicates (same subject + same time)
            $sentStr = $item.SentOn.ToString("yyyy-MM-ddTHH:mm:ss")
            $isDupe = $allResults | Where-Object { $_.Subject -eq $subj -and $_.SentOn -eq $sentStr }
            if ($isDupe) { continue }

            # --- Account scoping: keyword hits must involve a known contact or mention the account name ---
            if ($Contacts.Count -gt 0) {
                $contactInvolved = $false

                # Check sender against known contacts
                try {
                    $kwSender = $item.SenderEmailAddress
                    if ($kwSender -and $kwSender.Contains("/")) {
                        $kwSender = $item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
                    }
                    if ($kwSender) {
                        $kwSenderLower = $kwSender.ToLower()
                        foreach ($c in $Contacts) {
                            if ($kwSenderLower.Contains($c.ToLower())) { $contactInvolved = $true; break }
                        }
                    }
                } catch { }

                # Check recipients against known contacts
                if (-not $contactInvolved) {
                    try {
                        for ($ri = 1; $ri -le $item.Recipients.Count; $ri++) {
                            $kwRecip = $item.Recipients.Item($ri)
                            $kwAddr = ""
                            try { $kwAddr = $kwRecip.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x39FE001F") } catch { $kwAddr = $kwRecip.Address }
                            if ($kwAddr) {
                                $kwAddrLower = $kwAddr.ToLower()
                                foreach ($c in $Contacts) {
                                    if ($kwAddrLower.Contains($c.ToLower())) { $contactInvolved = $true; break }
                                }
                            }
                            if ($contactInvolved) { break }
                        }
                    } catch { }
                }

                # Allow if subject contains the account name (even without contact match)
                if (-not $contactInvolved -and $AccountName -and $subjLower.Contains($AccountName.ToLower())) {
                    $contactInvolved = $true
                }

                if (-not $contactInvolved) { continue }
            }

            $toList = @()
            $ccList = @()
            try {
                for ($r = 1; $r -le $item.Recipients.Count; $r++) {
                    $recip = $item.Recipients.Item($r)
                    $addr = ""
                    try { $addr = $recip.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x39FE001F") } catch { $addr = $recip.Address }
                    $name = $recip.Name
                    $entry = if ($addr) { "$name <$addr>" } else { $name }
                    if ($recip.Type -eq 1) { $toList += $entry }
                    elseif ($recip.Type -eq 2) { $ccList += $entry }
                }
            } catch { }

            $senderDisplay = ""
            try { $senderDisplay = "$($item.SenderName) <$($item.SenderEmailAddress)>" } catch { }

            # Extract plain-text body (truncate to 4000 chars)
            $kwBodyText = ""
            try { $kwBodyText = $item.Body } catch { }
            if ($kwBodyText.Length -gt 4000) { $kwBodyText = $kwBodyText.Substring(0, 4000) + "`n[...truncated at 4000 chars]" }

            $allResults += [PSCustomObject]@{
                Subject      = $subj
                SentOn       = $sentStr
                ReceivedTime = $item.ReceivedTime.ToString("yyyy-MM-ddTHH:mm:ss")
                From         = $senderDisplay
                To           = ($toList -join "; ")
                Cc           = ($ccList -join "; ")
                Folder       = $folder.N
                MatchContact = "keyword:$($Keywords -join ',')"
                ConvTopic    = $item.ConversationTopic
                Body         = $kwBodyText
            }
        }
    }
    $kwTotal = ($allResults | Where-Object { $_.MatchContact -like "keyword:*" }).Count
    Write-Host "  Keyword hits: $kwTotal" -ForegroundColor Gray
}

# --- Deduplicate by Subject + SentOn ---
$deduped = $allResults | Sort-Object Subject, SentOn -Unique | Sort-Object SentOn -Descending

# --- Analyze: flag unanswered sent items ---
$sentMessages = $deduped | Where-Object { $_.Folder -eq "SentItems" }
$inboxMessages = $deduped | Where-Object { $_.Folder -eq "Inbox" }

$flagged = @()
foreach ($sent in $sentMessages) {
    $convTopic = $sent.ConvTopic
    $sentTime = [datetime]::Parse($sent.SentOn)

    # Check if any inbox message on the same conversation topic arrived after this send
    $replies = $inboxMessages | Where-Object {
        $_.ConvTopic -eq $convTopic -and [datetime]::Parse($_.ReceivedTime) -gt $sentTime
    }

    $elapsed = (Get-Date) - $sentTime
    $flagged += [PSCustomObject]@{
        Subject        = $sent.Subject
        SentOn         = $sent.SentOn
        To             = $sent.To
        Cc             = $sent.Cc
        ConvTopic      = $convTopic
        HasReply       = ($replies.Count -gt 0)
        LatestReply    = if ($replies.Count -gt 0) { ($replies | Sort-Object ReceivedTime -Descending | Select-Object -First 1).ReceivedTime } else { $null }
        ReplyFrom      = if ($replies.Count -gt 0) { ($replies | Sort-Object ReceivedTime -Descending | Select-Object -First 1).From } else { $null }
        DaysWaiting    = [math]::Round($elapsed.TotalDays, 1)
        Status         = if ($replies.Count -gt 0) { "REPLIED" } else { "NO_RESPONSE" }
    }
}

# --- Build output ---
$output = [PSCustomObject]@{
    account       = $AccountName
    searchDate    = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    daysBack      = $DaysBack
    contacts      = $Contacts
    keywords      = $Keywords
    totalMessages = $deduped.Count
    sentCount     = $sentMessages.Count
    inboxCount    = $inboxMessages.Count
    flaggedCount  = ($flagged | Where-Object { $_.Status -eq "NO_RESPONSE" }).Count
    messages      = $deduped
    analysis      = $flagged
}

$json = $output | ConvertTo-Json -Depth 4

if ($OutputPath) {
    $json | Set-Content -Path $OutputPath -Encoding UTF8
    Write-Host "`nResults written to: $OutputPath" -ForegroundColor Green
} else {
    Write-Output $json
}

# --- Summary ---
Write-Host "`n--- Summary ---" -ForegroundColor Yellow
Write-Host "Account:     $AccountName"
Write-Host "Period:      Last $DaysBack days"
Write-Host "Total msgs:  $($deduped.Count)  (Sent: $($sentMessages.Count), Inbox: $($inboxMessages.Count))"
$noReply = ($flagged | Where-Object { $_.Status -eq "NO_RESPONSE" })
if ($noReply.Count -gt 0) {
    Write-Host "FLAGGED:     $($noReply.Count) sent messages with no response" -ForegroundColor Red
    foreach ($nr in $noReply) {
        Write-Host "  - [$($nr.DaysWaiting)d] $($nr.Subject)" -ForegroundColor Red
        Write-Host "    To: $($nr.To)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "All sent messages have responses." -ForegroundColor Green
}
