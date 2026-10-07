$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $Python)) { $Python = 'python' }
& $Python -m py_compile apps/api/main.py apps/api/security_audit.py packaging/launcher.py scripts/security_audit.py
if ($LASTEXITCODE -ne 0) { throw 'Python compilation failed.' }
& $Python scripts/catalog_version.py
if ($LASTEXITCODE -ne 0) { throw 'Catalog metadata validation failed.' }
& $Python scripts/validate_content.py
if ($LASTEXITCODE -ne 0) { throw 'Content validation failed.' }
& $Python scripts/security_audit.py --format summary
if ($LASTEXITCODE -ne 0) { throw 'Security audit failed.' }
New-Item -ItemType Directory -Force '.build\pytest-test', '.build\pytest-cache' | Out-Null
& $Python -m pytest -q --basetemp '.build\pytest-test' -o cache_dir='.build\pytest-cache'
if ($LASTEXITCODE -ne 0) { throw 'Python tests failed.' }
npm run lint
if ($LASTEXITCODE -ne 0) { throw 'Lint failed.' }
npm run test:unit
if ($LASTEXITCODE -ne 0) { throw 'Frontend unit tests failed.' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Production build failed.' }
Write-Host 'Checks passed.' -ForegroundColor Green
