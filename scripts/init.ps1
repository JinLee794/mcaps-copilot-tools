<# Cross-platform init wrapper — delegates to scripts/init.js #>
<# Usage:  .\scripts\init.ps1 [-Check] #>
param([switch]$Check)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Args_ = if ($Check) { @("--check") } else { @() }
& node "$ScriptDir\init.js" @Args_
exit $LASTEXITCODE
