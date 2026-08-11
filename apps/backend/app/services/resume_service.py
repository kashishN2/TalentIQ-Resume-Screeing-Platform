import shutil
import uuid
import zipfile
from pathlib import Path

from fastapi import HTTPException, UploadFile

from sqlalchemy.orm import Session

from app.services.pdf_service import PDFService
from app.services.parser_service import parse_resume

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

        self.db = db

        self.resume_repo = ResumeRepository(db)

        self.job_repo = JobRepository(db)

    def validate_zip(
        self,
        file: UploadFile,
    ):
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file selected.",
            )

        if not file.filename.lower().endswith(".zip"):
            raise HTTPException(
                status_code=400,
                detail="Only ZIP files are allowed.",
            )

    def save_temp_zip(
        self,
        file: UploadFile,
    ):
        safe_filename = Path(
            file.filename
        ).name

        temp_path = TEMP_DIR / (
            f"{uuid.uuid4()}_{safe_filename}"
        )

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

            path.unlink(missing_ok=True)

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

            path.unlink(missing_ok=True)

            raise HTTPException(
                status_code=400,
                detail="Invalid ZIP file.",
            )

    def extract_pdfs(
        self,
        zip_path: Path,
    ):
        extracted = []

        seen_filenames = set()

        with zipfile.ZipFile(zip_path) as zip_ref:

            for member in zip_ref.infolist():

                if member.is_dir():
                    continue

                if not member.filename.lower().endswith(".pdf"):
                    continue

                filename = Path(
                    member.filename
                ).name

                if not filename:
                    continue

                # Avoid duplicate filenames inside
                # the same ZIP.
                if filename.lower() in seen_filenames:
                    continue

                seen_filenames.add(
                    filename.lower()
                )

                destination = (
                    EXTRACTED_DIR / filename
                )

                # Remove an old temporary extracted
                # file with the same name.
                destination.unlink(
                    missing_ok=True
                )

                with zip_ref.open(member) as source:

                    with open(
                        destination,
                        "wb",
                    ) as target:

                        shutil.copyfileobj(
                            source,
                            target,
                        )

                extracted.append(
                    destination
                )

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

    def is_duplicate_resume(
        self,
        job_id,
        original_filename: str,
    ):
        existing = (
            self.db.query(Resume)
            .filter(
                Resume.job_id == job_id,
                Resume.original_filename
                == original_filename,
            )
            .first()
        )

        return existing is not None

    def filter_duplicate_files(
        self,
        job_id,
        extracted_files,
    ):
        new_files = []
        skipped = 0

        for pdf in extracted_files:

            if self.is_duplicate_resume(
                job_id,
                pdf.name,
            ):
                pdf.unlink(
                    missing_ok=True
                )

                skipped += 1

                continue

            new_files.append(pdf)

        return new_files, skipped

    def move_resumes(
        self,
        extracted_files,
        job_folder,
    ):
        stored = []

        for pdf in extracted_files:

            filename = self.unique_filename()

            destination = (
                job_folder / filename
            )

            shutil.move(
                str(pdf),
                str(destination),
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

        pdf_service = PDFService()

        for original, stored, path in stored_files:

            try:
                text = pdf_service.extract_text(
                    path
                )

                parsed = parse_resume(text)

                candidate_name = parsed.get(
                    "name"
                )

                email = parsed.get(
                    "email"
                )

                phone = parsed.get(
                    "phone"
                )

                if not candidate_name:
                    candidate_name = (
                        Path(original)
                        .stem
                        .replace(
                            "_",
                            " ",
                        )
                    )

                resumes.append(
                    Resume(
                        job_id=job_id,
                        candidate_name=candidate_name,
                        email=email,
                        phone=phone,
                        original_filename=original,
                        stored_filename=stored,
                        file_path=str(path),
                        upload_status=(
                            UploadStatus.UPLOADED
                        ),
                    )
                )

            except Exception:
                # If parsing fails, remove the stored
                # file instead of creating a broken DB row.
                path.unlink(
                    missing_ok=True
                )

        return resumes

    def save_resumes(
        self,
        resumes,
    ):
        if not resumes:
            return

        self.resume_repo.bulk_create(
            resumes
        )

    def upload_zip(
        self,
        job_id,
        file,
    ):
        temp = None

        try:

            self.validate_zip(file)

            temp = self.save_temp_zip(
                file
            )

            self.validate_size(
                temp
            )

            self.validate_zip_file(
                temp
            )

            extracted = self.extract_pdfs(
                temp
            )

            if not extracted:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "No PDF resumes found "
                        "inside the ZIP file."
                    ),
                )

            # Remove resumes that have already
            # been uploaded for this job.
            (
                new_files,
                skipped_duplicates,
            ) = self.filter_duplicate_files(
                job_id,
                extracted,
            )

            if not new_files:

                return {
                    "job_id": job_id,
                    "uploaded": 0,
                    "failed": 0,
                    "message": (
                        "All resumes in this ZIP "
                        "were already uploaded."
                    ),
                }

            folder = self.create_job_folder(
                job_id
            )

            stored = self.move_resumes(
                new_files,
                folder,
            )

            resumes = self.build_resume_objects(
                job_id,
                stored,
            )

            self.save_resumes(
                resumes
            )

            uploaded_count = len(resumes)

            if skipped_duplicates > 0:

                message = (
                    f"{uploaded_count} resume(s) "
                    f"uploaded successfully. "
                    f"{skipped_duplicates} "
                    f"duplicate resume(s) skipped."
                )

            else:

                message = (
                    "Upload completed successfully."
                )

            return {
                "job_id": job_id,
                "uploaded": uploaded_count,
                "failed": 0,
                "message": message,
            }

        finally:

            if temp is not None:
                temp.unlink(
                    missing_ok=True
                )

    def get_resume(
        self,
        resume_id,
    ):
        return self.resume_repo.get_by_id(
            resume_id
        )

    def get_resumes_by_job(
        self,
        job_id,
        skip,
        limit,
    ):
        return self.resume_repo.get_by_job(
            job_id,
            skip,
            limit,
        )

    def count_resumes(
        self,
        job_id,
    ):
        return self.resume_repo.count_by_job(
            job_id
        )