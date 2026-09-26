$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

Write-Host 'Checking local tools...' -ForegroundColor Cyan
foreach ($tool in @('python', 'node', 'npm', 'git', 'code')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { Write-Warning "$tool was not found in PATH" }
}

if (-not (Test-Path '.venv')) { python -m venv .venv }
$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
& $Python -m pip install --upgrade pip | Out-Host
& $Python -m pip install -r apps/api/requirements.txt | Out-Host
npm install | Out-Host
New-Item -ItemType Directory -Force '.data', 'journal\weekly', 'journal\context' | Out-Null
& $Python -c "from apps.api.main import init_db; init_db(); print('Database seeded')"
Write-Host 'Setup complete.' -ForegroundColor Green
