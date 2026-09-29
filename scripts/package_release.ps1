# Create a reproducible Windows release archive for Journey AI Engineer.
[CmdletBinding()]
param(
    [string]$Version = "",
    [string]$OutputDir = ""
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $ProjectRoot

function Invoke-Checked {
    param([string]$File, [string[]]$Arguments)
    & $File @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$File failed with exit code $LASTEXITCODE."
    }
}

$Package = Get-Content -Raw -LiteralPath (Join-Path $ProjectRoot "package.json") | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($Version)) {
    $Version = [string]$Package.version
}
if ($Version -notmatch '^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$') {
    throw "Version '$Version' is not a valid semantic version."
}
if ([string]::IsNullOrWhiteSpace($OutputDir)) {
    $OutputDir = Join-Path $ProjectRoot ".build\releases"
}
$OutputDir = [IO.Path]::GetFullPath($OutputDir)
$Stage = Join-Path $ProjectRoot ".build\release-stage-$Version"
$ZipName = "JourneyAIEngineer-v$Version-windows-x64.zip"
$ZipPath = Join-Path $OutputDir $ZipName
$HashPath = Join-Path $OutputDir "SHA256SUMS.txt"

$Python = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $Python)) { $Python = "python" }
$Npm = (Get-Command npm -ErrorAction Stop).Source

Write-Host "Running content validation..." -ForegroundColor Cyan
Invoke-Checked $Python @("scripts/validate_content.py")
Write-Host "Running frontend lint/build..." -ForegroundColor Cyan
Invoke-Checked $Npm @("run", "lint")
Invoke-Checked $Npm @("run", "build")
Write-Host "Running backend tests..." -ForegroundColor Cyan
Invoke-Checked $Python @("-m", "pytest", "-q", "--basetemp", ".build\pytest-release", "-o", "cache_dir=.build\pytest-cache")

Write-Host "Building portable executable..." -ForegroundColor Cyan
& (Join-Path $ProjectRoot "scripts\build_exe.ps1")
if ($LASTEXITCODE -ne 0) { throw "build_exe.ps1 failed with exit code $LASTEXITCODE." }

$Exe = Join-Path $ProjectRoot "JourneyAIEngineer.exe"
if (-not (Test-Path -LiteralPath $Exe)) { throw "Missing $Exe after build." }

if (Test-Path -LiteralPath $Stage) { Remove-Item -LiteralPath $Stage -Recurse -Force }
New-Item -ItemType Directory -Path $Stage, $OutputDir -Force | Out-Null
Copy-Item -LiteralPath $Exe -Destination (Join-Path $Stage "JourneyAIEngineer.exe")
Copy-Item -LiteralPath (Join-Path $ProjectRoot "README.md") -Destination $Stage
Copy-Item -LiteralPath (Join-Path $ProjectRoot "LICENSE") -Destination $Stage
Copy-Item -LiteralPath (Join-Path $ProjectRoot "docs\QUICKSTART-WINDOWS.md") -Destination $Stage
@"
Journey AI Engineer $Version
Build date (UTC): $([DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"))
Source: https://github.com/Hzyl/JourneyAIEngineer
"@ | Set-Content -LiteralPath (Join-Path $Stage "VERSION.txt") -Encoding utf8

$Forbidden = @(
    ".data", ".db", ".sqlite", ".sqlite3", ".venv", "node_modules",
    ".env", "secrets", "journal/context", "__pycache__", ".pytest_cache",
    "JourneyAIEngineer.exe.lock"
)
$AllStageFiles = Get-ChildItem -LiteralPath $Stage -Recurse -File
foreach ($File in $AllStageFiles) {
    $Relative = $File.FullName.Substring($Stage.Length + 1).Replace("\", "/")
    foreach ($Needle in $Forbidden) {
        if ($Relative -match [regex]::Escape($Needle)) {
            throw "Forbidden path in release stage: $Relative"
        }
    }
}
if (Test-Path -LiteralPath $ZipPath) { Remove-Item -LiteralPath $ZipPath -Force }
Compress-Archive -Path (Join-Path $Stage "*") -DestinationPath $ZipPath -CompressionLevel Optimal

$Archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
    foreach ($Entry in $Archive.Entries) {
        $Name = $Entry.FullName.Replace("\", "/")
        foreach ($Needle in $Forbidden) {
            if ($Name -match [regex]::Escape($Needle)) {
                throw "Forbidden path in ZIP: $Name"
            }
        }
    }
} finally {
    $Archive.Dispose()
}

$sha256 = [System.Security.Cryptography.SHA256]::Create()
try {
    $Hash = ([BitConverter]::ToString($sha256.ComputeHash([IO.File]::ReadAllBytes($ZipPath)))).Replace("-", "").ToLowerInvariant()
} finally {
    $sha256.Dispose()
}
"$Hash  $ZipName" | Set-Content -LiteralPath $HashPath -Encoding ascii
Remove-Item -LiteralPath $Stage -Recurse -Force
Write-Host "Created $ZipPath" -ForegroundColor Green
Write-Host "SHA256: $Hash" -ForegroundColor Green
