param([string]$OutputDir = "")

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot
if ([string]::IsNullOrWhiteSpace($OutputDir)) { $OutputDir = $ProjectRoot }
$OutputDir = [IO.Path]::GetFullPath($OutputDir)
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $Python)) {
    throw 'Missing .venv. Run .\scripts\setup.ps1 first.'
}

Write-Host 'Building production frontend...' -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }

$PyInstaller = Join-Path $ProjectRoot '.venv\Scripts\pyinstaller.exe'
if (-not (Test-Path -LiteralPath $PyInstaller)) {
    Write-Host 'Installing PyInstaller into the local virtual environment...' -ForegroundColor Cyan
    & $Python -m pip install --disable-pip-version-check 'pyinstaller>=6,<7'
}
if (-not (Test-Path -LiteralPath $PyInstaller)) {
    throw 'PyInstaller was not found after installation.'
}

$BuildRoot = Join-Path $ProjectRoot ('.build\pyinstaller-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $BuildRoot | Out-Null
Write-Host 'Packaging JourneyAIEngineer.exe...' -ForegroundColor Cyan
& $PyInstaller --noconfirm --clean --distpath $OutputDir --workpath $BuildRoot (Join-Path $ProjectRoot 'packaging\JourneyAIEngineer.spec')
if ($LASTEXITCODE -ne 0) {
    throw "PyInstaller failed with exit code $LASTEXITCODE."
}

$ExePath = Join-Path $OutputDir 'JourneyAIEngineer.exe'
if (-not (Test-Path -LiteralPath $ExePath)) {
    throw 'PyInstaller did not create JourneyAIEngineer.exe.'
}

# Retain build intermediates for diagnostics; never remove a running preview's dist.

$sizeMb = [math]::Round((Get-Item -LiteralPath $ExePath).Length / 1MB, 1)
Write-Host "Created $ExePath ($sizeMb MB)" -ForegroundColor Green
Write-Host 'Double-click JourneyAIEngineer.exe to start the local app.' -ForegroundColor Green
