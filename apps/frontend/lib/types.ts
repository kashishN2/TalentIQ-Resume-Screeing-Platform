export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_min: number;
  experience_max: number;
  description: string;
  required_skills: string[];
  minimum_score: number;
  status: "OPEN" | "CLOSED";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
}

export interface Resume {
  id: string;
  job_id: string;
  candidate_name: string;
  email: string | null;
  phone: string | null;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  upload_status: "UPLOADED" | "ANALYZING" | "ANALYZED" | "FAILED";
  created_at: string;
}

export interface ResumeListResponse {
  resumes: Resume[];
  total: number;
}

export interface SkillEvidence {
  skill: string;
  evidence: string;
}

export interface CandidateAnalysis {
  rank: number;
  resume_id: string;
  candidate_name: string;
  email: string | null;
  ats_score: number;
  ai_score: number;
  overall_score: number;
  recommendation: string;
  confidence: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  recruiter_summary: string;
  evidence: SkillEvidence[];
  analyzed_at: string;
}

export interface JobAnalysis {
  job_id: string;
  total_analyzed: number;
  candidates: CandidateAnalysis[];
}

export interface UploadSummary {
  job_id: string;
  uploaded: number;
  failed: number;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  recipient: string;
  decision: "SHORTLIST" | "REJECT";
  message: string;
}