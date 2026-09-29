$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $Python)) { $Python = 'python' }
& $Python -m py_compile apps/api/main.py apps/api/security_audit.py packaging/launcher.py scripts/security_audit.py
& $Python scripts/validate_content.py
& $Python scripts/security_audit.py --format summary
New-Item -ItemType Directory -Force '.build\pytest-test', '.build\pytest-cache' | Out-Null
& $Python -m pytest -q --basetemp '.build\pytest-test' -o cache_dir='.build\pytest-cache'
npm run lint
npm run build
Write-Host 'Checks passed.' -ForegroundColor Green
