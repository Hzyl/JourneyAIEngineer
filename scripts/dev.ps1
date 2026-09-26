$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $Python)) { $Python = 'python' }

$api = Start-Process -FilePath $Python -ArgumentList '-m','uvicorn','apps.api.main:app','--host','127.0.0.1','--port','8000','--reload' -WorkingDirectory $ProjectRoot -PassThru
$web = Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--host','127.0.0.1' -WorkingDirectory $ProjectRoot -PassThru
Write-Host "API: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "Web: http://127.0.0.1:5173" -ForegroundColor Cyan
Write-Host 'Press Ctrl+C to stop both processes.' -ForegroundColor Yellow
try { while (-not $api.HasExited -and -not $web.HasExited) { Start-Sleep -Seconds 1 } }
finally { if (-not $api.HasExited) { Stop-Process -Id $api.Id -Force }; if (-not $web.HasExited) { Stop-Process -Id $web.Id -Force } }
