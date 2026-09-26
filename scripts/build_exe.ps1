$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$Python = Join-Path $ProjectRoot '.venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $Python)) {
    throw 'Missing .venv. Run .\scripts\setup.ps1 first.'
}

Write-Host 'Building production frontend...' -ForegroundColor Cyan
npm run build

$PyInstaller = Join-Path $ProjectRoot '.venv\Scripts\pyinstaller.exe'
if (-not (Test-Path -LiteralPath $PyInstaller)) {
    Write-Host 'Installing PyInstaller into the local virtual environment...' -ForegroundColor Cyan
    & $Python -m pip install --disable-pip-version-check 'pyinstaller>=6,<7'
}
if (-not (Test-Path -LiteralPath $PyInstaller)) {
    throw 'PyInstaller was not found after installation.'
}

$BuildRoot = Join-Path $ProjectRoot '.build\pyinstaller'
New-Item -ItemType Directory -Force -Path $BuildRoot | Out-Null
Write-Host 'Packaging JourneyAIEngineer.exe...' -ForegroundColor Cyan
& $PyInstaller --noconfirm --clean --distpath $ProjectRoot --workpath $BuildRoot (Join-Path $ProjectRoot 'packaging\JourneyAIEngineer.spec')
if ($LASTEXITCODE -ne 0) {
    throw "PyInstaller failed with exit code $LASTEXITCODE."
}

$ExePath = Join-Path $ProjectRoot 'JourneyAIEngineer.exe'
if (-not (Test-Path -LiteralPath $ExePath)) {
    throw 'PyInstaller did not create JourneyAIEngineer.exe.'
}

if (Test-Path -LiteralPath $BuildRoot) {
    Remove-Item -LiteralPath $BuildRoot -Recurse -Force
}
if (Test-Path -LiteralPath (Join-Path $ProjectRoot 'dist')) {
    Remove-Item -LiteralPath (Join-Path $ProjectRoot 'dist') -Recurse -Force
}

$sizeMb = [math]::Round((Get-Item -LiteralPath $ExePath).Length / 1MB, 1)
Write-Host "Created $ExePath ($sizeMb MB)" -ForegroundColor Green
Write-Host 'Double-click JourneyAIEngineer.exe to start the local app.' -ForegroundColor Green
