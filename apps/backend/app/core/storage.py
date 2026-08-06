from pathlib import Path

UPLOAD_DIR = Path("uploads")
TEMP_DIR = UPLOAD_DIR / "temp"
JOBS_DIR = UPLOAD_DIR / "jobs"
EXTRACTED_DIR = UPLOAD_DIR / "extracted"

for directory in [
    UPLOAD_DIR,
    TEMP_DIR,
    JOBS_DIR,
    EXTRACTED_DIR,
]:
    directory.mkdir(
        parents=True,
        exist_ok=True,
    )