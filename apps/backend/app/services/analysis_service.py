import uuid

from sqlalchemy.orm import Session

from app.models.resume import Resume, UploadStatus
from app.models.resume_analysis import ResumeAnalysis
from app.repositories.job_repository import JobRepository
from app.repositories.resume_repository import ResumeRepository
from app.services.ai.gemini_analyzer import GeminiAnalyzer
from app.services.ats_service import match_skills, skill_score
from app.services.pdf_service import PDFService
from app.services.parser_service import parse_resume
from app.services.ranking_service import create_candidate_result, rank_candidates
from app.services.score_fusion_service import (
    calculate_overall_score,
    get_recommendation,
)


class AnalysisService:

    def __init__(self, db: Session):

        self.db = db

        self.job_repo = JobRepository(db)
        self.resume_repo = ResumeRepository(db)

        self.pdf_service = PDFService()
        self.gemini = GeminiAnalyzer()

    def analyze_resume(
        self,
        resume: Resume,
        job,
    ) -> ResumeAnalysis:

        resume.upload_status = UploadStatus.ANALYZING

        try:

            # -----------------------------------
            # 1. Extract PDF text
            # -----------------------------------

            resume_text = self.pdf_service.extract_text(
                resume.file_path
            )

            if not resume_text.strip():
                raise ValueError(
                    "No readable text found in resume."
                )

            # -----------------------------------
            # 2. Parse resume
            # -----------------------------------
            
            # ...existing code...
            parsed_resume = parse_resume(
                resume_text
            )
            
            # Update candidate information extracted from the resume
            resume.candidate_name = (
                parsed_resume.get("name")
                or resume.candidate_name
            )
            
            resume.email = (
                parsed_resume.get("email")
                or resume.email
            )
            resume.phone = (
                parsed_resume.get("phone")
                or resume.phone
            )
            
            resume_skills = parsed_resume.get(
                "skills",
                [],
            )
# ...existing code...
            # -----------------------------------
            # 3. ATS skill matching
            # -----------------------------------

            matched_skills, missing_skills = match_skills(
                job.required_skills or [],
                resume_skills,
            )

            ats_score = skill_score(
                matched_skills,
                job.required_skills or [],
            )

            # -----------------------------------
            # 4. Gemini analysis
            # -----------------------------------

            ai_result = self.gemini.analyze(
                resume_text=resume_text,
                job_description=job.description,
            )

            ai_score = ai_result.ai_score

            # -----------------------------------
            # 5. Score fusion
            # -----------------------------------

            overall_score = calculate_overall_score(
                ats_score=ats_score,
                ai_score=ai_score,
            )

            recommendation = get_recommendation(
                overall_score
            )

            # -----------------------------------
            # 6. Save analysis
            # -----------------------------------

            analysis = ResumeAnalysis(
                resume_id=resume.id,

                ats_score=round(
                    ats_score,
                    2,
                ),

                ai_score=round(
                    ai_score,
                    2,
                ),

                overall_score=overall_score,

                confidence=ai_result.confidence,

                matched_skills=matched_skills,

                missing_skills=missing_skills,

                strengths=ai_result.strengths,

                weaknesses=ai_result.weaknesses,

                evidence=[
                    evidence.model_dump()
                    for evidence
                    in ai_result.evidence
                ],

                recruiter_summary=ai_result.summary,

                recommendation=recommendation,
            )

            if resume.analysis:

                resume.analysis = analysis

            else:

                self.db.add(analysis)

            resume.upload_status = UploadStatus.ANALYZED

            self.db.flush()

            return analysis

        except Exception:

            resume.upload_status = UploadStatus.FAILED

            self.db.flush()

            raise

    def analyze_job(
        self,
        job_id: uuid.UUID,
    ):

        # -----------------------------------
        # 1. Get job
        # -----------------------------------

        job = self.job_repo.get_by_id(
            job_id
        )

        if job is None:

            raise ValueError(
                "Job not found."
            )

        # -----------------------------------
        # 2. Get resumes
        # -----------------------------------

        resumes = self.resume_repo.get_by_job(
            job_id,
            0,
            1000,
        )

        if not resumes:

            raise ValueError(
                "No resumes found for this job."
            )

        # -----------------------------------
        # 3. Analyze each resume
        # -----------------------------------

        analyses = []

        for resume in resumes:

            try:

                analysis = self.analyze_resume(
                    resume,
                    job,
                )

                analyses.append(
                    analysis
                )

            except Exception as exc:

                print(
                    f"Analysis failed for "
                    f"{resume.id}: {exc}"
                )

        # -----------------------------------
        # 4. Commit analyses
        # -----------------------------------

        self.db.commit()

        # -----------------------------------
        # 5. Create ranking objects
        # -----------------------------------

        ranking_candidates = []

        for analysis in analyses:

            ranking_candidates.append(
                create_candidate_result(
                    candidate_id=str(
                        analysis.resume_id
                    ),
                    ats_score=analysis.ats_score,
                    ai_score=analysis.ai_score,
                )
            )

        # -----------------------------------
        # 6. Rank candidates
        # -----------------------------------

        ranked_candidates = rank_candidates(
            ranking_candidates
        )

        return ranked_candidates

    def get_job_analysis(
        self,
        job_id: uuid.UUID,
    ):
    
        resumes = (
            self.resume_repo.get_analyzed_by_job(
                job_id
            )
        )
    
        candidates = []
    
        for resume in resumes:
    
            analysis = resume.analysis
    
            if analysis is None:
                continue
    
            candidates.append(
                {
                    "resume_id": resume.id,
    
                    "candidate_name": (
                        resume.candidate_name
                    ),
    
                    "email": resume.email,
    
                    "ats_score": (
                        analysis.ats_score
                    ),
    
                    "ai_score": (
                        analysis.ai_score
                    ),
    
                    "overall_score": (
                        analysis.overall_score
                    ),
    
                    "recommendation": (
                        analysis.recommendation.value
                        if hasattr(
                            analysis.recommendation,
                            "value",
                        )
                        else analysis.recommendation
                    ),
    
                    "confidence": (
                        analysis.confidence
                    ),
    
                    "matched_skills": (
                        analysis.matched_skills or []
                    ),
    
                    "missing_skills": (
                        analysis.missing_skills or []
                    ),
    
                    "strengths": (
                        analysis.strengths or []
                    ),
    
                    "weaknesses": (
                        analysis.weaknesses or []
                    ),
    
                    "recruiter_summary": (
                        analysis.recruiter_summary
                    ),
    
                    "evidence": (
                        analysis.evidence or []
                    ),
    
                    "analyzed_at": (
                        analysis.analyzed_at
                    ),
                }
            )
    
        # Highest overall score first
        candidates.sort(
            key=lambda candidate:
                candidate["overall_score"],
            reverse=True,
        )
    
        # Assign ranks after sorting
        for rank, candidate in enumerate(
            candidates,
            start=1,
        ):
            candidate["rank"] = rank
    
        return {
            "job_id": job_id,
    
            "total_analyzed": len(
                candidates
            ),
    
            "candidates": candidates,
        }