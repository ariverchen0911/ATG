# 116 ATG POC V1.1.0 / 2026-10-04
$ErrorActionPreference = 'Stop'
$pocRoot = $PSScriptRoot
$pocPort = 8816
$pocBundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if (Test-Path -LiteralPath $pocBundledPython) { $pocPython = $pocBundledPython } else {
    $pocCommand = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pocCommand) { throw 'Python unavailable. Open index.html directly or use an approved local web server.' }
    $pocPython = $pocCommand.Source
}
$pocListener = Get-NetTCPConnection -LocalPort $pocPort -State Listen -ErrorAction SilentlyContinue
if ($pocListener) { throw "Port $pocPort is in use. Stop the existing POC server or choose another port." }
$pocProcess = Start-Process -FilePath $pocPython -ArgumentList @('-m', 'http.server', "$pocPort", '--bind', '127.0.0.1') -WorkingDirectory $pocRoot -WindowStyle Hidden -PassThru
Set-Content -LiteralPath (Join-Path $pocRoot 'poc-server.pid') -Value $pocProcess.Id
Start-Sleep -Milliseconds 1000
if ($pocProcess.HasExited) { throw 'POC server failed to start.' }
Start-Process "http://127.0.0.1:$pocPort/index.html"
Write-Host "POC PID $($pocProcess.Id). Stop with Stop-Process -Id $($pocProcess.Id)."
