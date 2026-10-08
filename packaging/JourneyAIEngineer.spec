# PyInstaller one-file build for the portable Windows app.

from pathlib import Path
import sys

from PyInstaller.building.build_main import Analysis, EXE, PYZ
from PyInstaller.utils.hooks import collect_submodules


ROOT = Path(SPECPATH).resolve().parent
sys.path.insert(0, str(ROOT))
from scripts.package_source import content_bundle_data

hiddenimports = []
for package in ("fastapi", "starlette", "uvicorn", "pydantic"):
    hiddenimports.extend(collect_submodules(package))

analysis = Analysis(
    [str(ROOT / "packaging" / "launcher.py")],
    pathex=[str(ROOT)],
    binaries=[],
    datas=content_bundle_data(ROOT) + [(str(ROOT / "dist"), "dist")],
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
)

pyz = PYZ(analysis.pure)
exe = EXE(
    pyz,
    analysis.scripts,
    analysis.binaries,
    analysis.datas,
    [],
    name="JourneyAIEngineer",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,
    disable_windowed_traceback=False,
)
