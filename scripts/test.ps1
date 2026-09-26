$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $Python)) { $Python = 'python' }
& $Python -m py_compile apps/api/main.py
& $Python scripts/validate_content.py
& $Python -m pytest -q
npm run lint
npm run build
Write-Host 'Checks passed.' -ForegroundColor Green
