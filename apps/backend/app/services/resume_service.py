import shutil
import uuid
import zipfile
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.storage import (
    EXTRACTED_DIR,
    JOBS_DIR,
    TEMP_DIR,
)
from app.models.resume import (
    Resume,
    UploadStatus,
)
from app.repositories.job_repository import JobRepository
from app.repositories.resume_repository import ResumeRepository
class ResumeService:

    MAX_ZIP_SIZE = 50 * 1024 * 1024  # 50 MB

    def __init__(self, db: Session):

        self.resume_repo = ResumeRepository(db)

        self.job_repo = JobRepository(db)

    def validate_zip(
        self,
        file: UploadFile,
    ):
    
        if not file.filename.lower().endswith(".zip"):
    
            raise HTTPException(
                status_code=400,
                detail="Only ZIP files are allowed.",
            )

    def save_temp_zip(
        self,
        file: UploadFile,
    ):
    
        temp_path = TEMP_DIR / file.filename
    
        with open(temp_path, "wb") as buffer:
    
            shutil.copyfileobj(
                file.file,
                buffer,
            )
    
        return temp_path

    def validate_size(
        self,
        path: Path,
    ):
    
        size = path.stat().st_size
    
        if size > self.MAX_ZIP_SIZE:
    
            path.unlink()
    
            raise HTTPException(
                status_code=400,
                detail="ZIP exceeds maximum size.",
            )

    def validate_zip_file(
        self,
        path: Path,
    ):
    
        try:
    
            with zipfile.ZipFile(path):
    
                pass
    
        except zipfile.BadZipFile:
    
            path.unlink()
    
            raise HTTPException(
                status_code=400,
                detail="Invalid ZIP file.",
            )

    def extract_pdfs(
        self,
        zip_path: Path,
    ):
    
        extracted = []
    
        with zipfile.ZipFile(zip_path) as zip_ref:
    
            for member in zip_ref.infolist():
    
                if member.is_dir():
                    continue
    
                if not member.filename.lower().endswith(".pdf"):
                    continue
    
                filename = Path(member.filename).name
    
                destination = EXTRACTED_DIR / filename
    
                with zip_ref.open(member) as source:
    
                    with open(destination, "wb") as target:
    
                        shutil.copyfileobj(
                            source,
                            target,
                        )
    
                extracted.append(destination)
    
        return extracted

    def create_job_folder(
        self,
        job_id,
    ):
    
        folder = JOBS_DIR / str(job_id)
    
        folder.mkdir(
            parents=True,
            exist_ok=True,
        )
    
        return folder

    def unique_filename(
        self,
        suffix=".pdf",
    ):
    
        return f"{uuid.uuid4()}{suffix}"

    def move_resumes(
        self,
        extracted_files,
        job_folder,
    ):
    
        stored = []
    
        for pdf in extracted_files:
    
            filename = self.unique_filename()
    
            destination = job_folder / filename
    
            shutil.move(
                pdf,
                destination,
            )
    
            stored.append(
                (
                    pdf.name,
                    filename,
                    destination,
                )
            )
    
        return stored

    def build_resume_objects(
        self,
        job_id,
        stored_files,
    ):
    
        resumes = []
    
        for original, stored, path in stored_files:
    
            candidate = Path(original).stem.replace(
                "_",
                " ",
            )
    
            resumes.append(
    
                Resume(
    
                    job_id=job_id,
    
                    candidate_name=candidate,
    
                    email=None,
    
                    phone=None,
    
                    original_filename=original,
    
                    stored_filename=stored,
    
                    file_path=str(path),
    
                    upload_status=UploadStatus.UPLOADED,
    
                )
    
            )
    
        return resumes

    def save_resumes(
        self,
        resumes,
    ):
    
        self.resume_repo.bulk_create(
            resumes
        )
    def upload_zip(
        self,
        job_id,
        file,
    ):
    
        self.validate_zip(file)
    
        temp = self.save_temp_zip(file)
    
        self.validate_size(temp)
    
        self.validate_zip_file(temp)
    
        extracted = self.extract_pdfs(temp)
    
        folder = self.create_job_folder(job_id)
    
        stored = self.move_resumes(
            extracted,
            folder,
        )
    
        resumes = self.build_resume_objects(
            job_id,
            stored,
        )
    
        self.save_resumes(
            resumes,
        )
    
        temp.unlink()
    
        return {
    
            "job_id": job_id,
    
            "uploaded": len(resumes),
    
            "failed": 0,
    
            "message": "Upload completed successfully.",
    
        }