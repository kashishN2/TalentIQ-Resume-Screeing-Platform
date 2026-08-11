# TalentIQ — AI-Powered Resume Screening & Recruitment Platform

> **TalentIQ** is a full-stack recruitment platform that helps recruiters manage job openings, upload and screen candidate resumes, rank applicants using a hybrid ATS + AI scoring pipeline, and send automated shortlist/rejection emails — all from a single dashboard.

![TalentIQ](https://img.shields.io/badge/TalentIQ-Recruitment%20Platform-4F46E5?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?style=flat-square\&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square\&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square\&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-3178C6?style=flat-square\&logo=typescript)
![Python](https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square\&logo=python)

---

## 🚀 Overview

Recruiters often have to manually review large numbers of resumes against the same job requirements. TalentIQ streamlines this process by combining:

* Job management
* Bulk resume upload
* Resume parsing
* ATS-style skill matching
* AI-powered candidate evaluation
* Candidate ranking
* Skill gap identification
* Recruiter-friendly candidate summaries
* JWT-based authentication
* Automated candidate decision emails
* PostgreSQL persistence
* RESTful backend APIs
* Responsive recruiter dashboard

The platform is designed around a simple workflow:

```text
Create Job
    ↓
Upload Candidate Resumes
    ↓
Parse Resume Data
    ↓
Run Candidate Analysis
    ↓
Calculate ATS + AI Scores
    ↓
Rank Candidates
    ↓
Review Strengths / Weaknesses
    ↓
Shortlist or Reject
    ↓
Send Candidate Email
```

---

# ✨ Key Features

## 🔐 Authentication & Authorization

TalentIQ uses JWT-based authentication to protect recruiter operations.

Features include:

* Secure login
* Password hashing using bcrypt
* JWT access tokens
* Token expiration
* Protected API routes
* Current-user dependency
* Authenticated recruiter workspace

Example authentication flow:

```text
Recruiter
   ↓
Login
   ↓
FastAPI Authentication API
   ↓
Credentials Validation
   ↓
JWT Access Token
   ↓
Frontend localStorage
   ↓
Authenticated API Requests
```

---

## 💼 Job Management

Recruiters can create and manage job openings.

Each job can contain:

* Job title
* Department
* Location
* Employment type
* Job description
* Required skills
* Minimum experience
* Maximum experience
* Minimum screening score
* Job status

Supported operations:

```text
Create Job
View Jobs
View Job Details
Update Job
Delete Job
```

Deleting a job also removes its associated uploaded resumes and dependent records through database relationships and cascading deletion.

---

## 📄 Bulk Resume Upload

Recruiters can upload multiple candidate resumes through a ZIP archive.

Example:

```text
resumes.zip
│
├── candidate_01.pdf
├── candidate_02.pdf
├── candidate_03.pdf
├── candidate_04.pdf
└── candidate_05.pdf
```

The backend processes the uploaded resumes and associates them with the selected job.

This makes the system suitable for screening batches of candidates rather than processing resumes individually.

---

## 🤖 AI-Powered Candidate Screening

TalentIQ combines traditional ATS-style screening with AI-assisted candidate evaluation.

The screening pipeline considers:

* Required skills
* Resume content
* Candidate experience
* Skill matches
* Missing skills
* Resume evidence
* Candidate strengths
* Candidate weaknesses
* Overall suitability

The final candidate profile contains:

```text
ATS Score
AI Score
Overall Score
Confidence
Matched Skills
Missing Skills
Strengths
Weaknesses
Recruiter Summary
Skill Evidence
Recommendation
```

---

# 📊 Hybrid Candidate Scoring

Instead of relying exclusively on AI, TalentIQ uses a hybrid screening approach.

```text
                  Resume
                     │
                     ▼
              Resume Parsing
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     ATS Analysis          AI Analysis
          │                     │
          │                     │
          └──────────┬──────────┘
                     ▼
              Score Aggregation
                     │
                     ▼
             Overall Candidate
                   Score
                     │
                     ▼
              Recommendation
```

This approach makes the screening process more structured and explainable than simply asking an LLM whether a candidate should be hired.

---

# 🏆 Candidate Ranking

After analysis, candidates are ranked according to their overall screening score.

Example:

| Rank | Candidate   | ATS | AI | Overall | Recommendation |
| ---: | ----------- | --: | -: | ------: | -------------- |
|    1 | Candidate A |  91 | 94 |      93 | SHORTLIST      |
|    2 | Candidate B |  87 | 89 |      88 | SHORTLIST      |
|    3 | Candidate C |  74 | 70 |      72 | REVIEW         |
|    4 | Candidate D |  52 | 48 |      50 | REJECT         |

Recruiters can quickly identify the strongest candidates without manually reviewing every resume from scratch.

---

# 🧩 Skill Matching & Evidence

TalentIQ does more than display a score.

For every candidate, recruiters can see:

### Matched Skills

```text
Python
FastAPI
PostgreSQL
REST APIs
Git
Docker
```

### Missing Skills

```text
AWS
Kubernetes
Redis
```

### Skill Evidence

The platform can show evidence extracted from the candidate's resume to explain why a skill was considered relevant.

This improves transparency and helps recruiters understand the reasoning behind the screening result.

---

# 📝 Recruiter Summary

Each analyzed candidate can include a concise recruiter-oriented summary.

Instead of forcing recruiters to read the entire resume first, TalentIQ provides a structured overview of the candidate's suitability.

Example:

```text
Strong backend candidate with relevant Python and FastAPI
experience. Demonstrates practical REST API and PostgreSQL
knowledge, but has limited evidence of cloud deployment.
Overall profile aligns well with the role.
```

---

# 📧 Automated Candidate Decision Emails

Recruiters can directly take action from the candidate analysis screen.

Available actions:

```text
✓ Shortlist & Email
✕ Reject & Email
```

When a recruiter selects a decision, TalentIQ automatically sends the corresponding email to the candidate.

### Shortlist Email

The candidate receives a professional application update informing them that they have been shortlisted and that the recruitment team will contact them regarding the next steps.

### Rejection Email

The candidate receives a professional rejection message thanking them for their time and interest.

The email service is implemented using SMTP and can be configured through environment variables.

---

# 🖥️ Recruiter Dashboard

The frontend provides a clean recruiter workflow.

Main screens include:

```text
/login
/jobs
/jobs/new
/jobs/[id]
/jobs/[id]/analysis
```

### Job Dashboard

Recruiters can:

* View available jobs
* Create new jobs
* Open job details
* View candidate counts
* Access screening results

### Job Details

Recruiters can:

* View job description
* View requirements
* View required skills
* Upload resumes
* Start candidate analysis
* Delete jobs

### Candidate Analysis

Recruiters can:

* View candidate ranking
* Compare scores
* Review matched skills
* Review missing skills
* Read strengths and weaknesses
* View skill evidence
* Read recruiter summaries
* Shortlist candidates
* Reject candidates
* Send candidate emails

---

# 🏗️ System Architecture

TalentIQ follows a modular full-stack architecture.

```text
                     ┌──────────────────────┐
                     │      Recruiter       │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Next.js Frontend   │
                     │   TypeScript + UI    │
                     └──────────┬───────────┘
                                │
                         API Proxy Layer
                                │
                                ▼
                     ┌──────────────────────┐
                     │    FastAPI Backend   │
                     │    RESTful APIs      │
                     └──────────┬───────────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
       Authentication      Resume Engine      AI Analysis
             │                  │                  │
             └──────────────────┼──────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │     PostgreSQL       │
                     └──────────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │    SMTP Email       │
                     └──────────────────────┘
```

---

# 🧱 Project Structure

```text
TalentIQ-Resume-Screeing-Platform/
│
├── apps/
│   │
│   ├── backend/
│   │   │
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── analysis.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── emails.py
│   │   │   │   ├── health.py
│   │   │   │   ├── jobs.py
│   │   │   │   └── resumes.py
│   │   │   │
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── dependencies.py
│   │   │   │   ├── security.py
│   │   │   │   └── storage.py
│   │   │   │
│   │   │   ├── db/
│   │   │   │   └── database.py
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user.py
│   │   │   │   ├── job.py
│   │   │   │   ├── resume.py
│   │   │   │   └── resume_analysis.py
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   └── user_repository.py
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │
│   │   │   └── services/
│   │   │       ├── auth_service.py
│   │   │       ├── email_service.py
│   │   │       ├── job_service.py
│   │   │       └── resume_service.py
│   │   │
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   └── .env
│   │
│   └── frontend/
│       │
│       ├── app/
│       │   ├── api/
│       │   │   └── proxy/
│       │   ├── jobs/
│       │   │   ├── [id]/
│       │   │   │   ├── analysis/
│       │   │   │   └── page.tsx
│       │   │   ├── new/
│       │   │   └── page.tsx
│       │   └── login/
│       │
│       ├── lib/
│       │   ├── api.ts
│       │   ├── auth.ts
│       │   └── types.ts
│       │
│       ├── package.json
│       └── .env.local
│
├── .gitignore
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* Next.js App Router
* Client-side authentication state
* API proxy layer

## Backend

* **Python**
* **FastAPI**
* **SQLAlchemy**
* Pydantic
* JWT authentication
* Passlib / bcrypt
* SMTP
* Resume parsing

## Database

* **PostgreSQL**
* SQLAlchemy ORM
* UUID-based entity identifiers
* Relational data modeling
* Cascade deletion

## AI / Screening

* Gemini-based AI analysis
* ATS-style deterministic scoring
* Skill extraction and comparison
* Candidate recommendation

## Development & Deployment

* Git
* GitHub
* Uvicorn
* Environment-based configuration
* Managed PostgreSQL
* Cloud deployment

---

# 🔒 Security

Security was considered at multiple layers.

### Password Security

Passwords are never stored as plaintext.

```text
Plain Password
      ↓
bcrypt hashing
      ↓
password_hash
      ↓
PostgreSQL
```

### JWT Authentication

Protected endpoints require a valid access token.

```text
Authorization: Bearer <access_token>
```

Expired or invalid tokens are rejected by the backend.

### Environment Variables

Sensitive credentials are kept outside source control.

Examples:

```env
DATABASE_URL=
SECRET_KEY=
GEMINI_API_KEY=
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_FROM=
```

`.env` files are excluded from Git using `.gitignore`.

---

# 🗄️ Database Design

The core data model consists of relationships between users, jobs, resumes, and resume analyses.

```text
User
 │
 │ 1:N
 ▼
Job
 │
 │ 1:N
 ▼
Resume
 │
 │ 1:N
 ▼
Resume Analysis
```

### User

Stores recruiter account information.

### Job

Stores recruitment requirements and job configuration.

### Resume

Stores candidate information and the relationship with the corresponding job.

### Resume Analysis

Stores screening and AI-generated candidate analysis.

---

# 🔄 Candidate Screening Flow

A complete candidate screening request follows this flow:

```text
1. Recruiter creates a job
             ↓
2. Recruiter uploads ZIP containing resumes
             ↓
3. Backend extracts and parses resumes
             ↓
4. Candidate information is stored
             ↓
5. Recruiter starts analysis
             ↓
6. ATS scoring is performed
             ↓
7. AI evaluation is performed
             ↓
8. Scores and evidence are combined
             ↓
9. Candidates are ranked
             ↓
10. Recruiter reviews analysis
             ↓
11. Recruiter chooses:
       ├── SHORTLIST
       └── REJECT
             ↓
12. Candidate receives automated email
```

---

# 🔌 API Overview

The backend exposes RESTful APIs.

## Authentication

```http
POST /auth/login
GET  /auth/me
```

## Health

```http
GET /health
```

## Jobs

```http
POST   /jobs
GET    /jobs
GET    /jobs/{job_id}
PUT    /jobs/{job_id}
DELETE /jobs/{job_id}
```

## Resumes

```http
GET  /jobs/{job_id}/resumes
POST /jobs/{job_id}/resumes/upload
```

## Analysis

```http
POST /jobs/{job_id}/analyze
GET  /jobs/{job_id}/analysis
```

## Candidate Decisions

```http
POST /jobs/{job_id}/resumes/{resume_id}/decision
```

---

# ⚙️ Local Development

## 1. Clone the Repository

```bash
git clone <your-repository-url>

cd TalentIQ-Resume-Screeing-Platform
```

---

## 2. Backend Setup

```bash
cd apps/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it.

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Backend Environment

Create:

```text
apps/backend/.env
```

Example:

```env
DATABASE_URL=postgresql://username:password@host:5432/database

SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

DEFAULT_ADMIN_NAME=TalentIQ Admin
DEFAULT_ADMIN_EMAIL=admin@talentiq.com
DEFAULT_ADMIN_PASSWORD=your-password

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=your-gemini-model

EMAIL_MODE=smtp

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email
```

**Never commit real credentials to GitHub.**

---

## 4. Start Backend

From:

```text
apps/backend
```

run:

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# 🌐 Frontend Setup

Open another terminal:

```bash
cd apps/frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
apps/frontend/.env.local
```

Example:

```env
BACKEND_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

# 🧪 Testing

Backend tests can be executed using:

```bash
cd apps/backend
pytest -q
```

The project includes automated backend tests covering important application functionality.

Before deployment, verify:

```text
✓ Backend starts successfully
✓ Database connection works
✓ Login works
✓ JWT authentication works
✓ Job creation works
✓ Job deletion works
✓ Resume upload works
✓ Resume analysis works
✓ Candidate ranking works
✓ Shortlist email works
✓ Rejection email works
```

---

# 📧 SMTP Configuration

TalentIQ uses SMTP for candidate emails.

Default Gmail configuration:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

For Gmail, use an **App Password** rather than your regular Gmail password when required by your account configuration.

The application uses:

```text
SMTP
 ↓
STARTTLS
 ↓
SMTP Authentication
 ↓
send_message()
```

---

# ☁️ Deployment

TalentIQ can be deployed using separate frontend, backend, and database services.

Recommended architecture:

```text
                Internet
                   │
          ┌────────┴────────┐
          ▼                 ▼
   Frontend Hosting    Backend Hosting
      Next.js             FastAPI
          │                 │
          └────────┬────────┘
                   ▼
            Managed PostgreSQL
```

Environment variables should be configured separately on the hosting platforms.

The frontend requires:

```env
BACKEND_URL=<deployed-backend-url>
```

The backend requires:

```env
DATABASE_URL=<managed-postgresql-url>
SECRET_KEY=<production-secret>
GEMINI_API_KEY=<gemini-key>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=<email>
SMTP_PASSWORD=<app-password>
SMTP_FROM=<email>
```

---

# 📈 Why TalentIQ?

Traditional resume screening can become repetitive and time-consuming when recruiters have hundreds of applications.

TalentIQ focuses on reducing this manual effort while keeping recruiters in control.

Instead of:

```text
100 Resumes
     ↓
Manual Review
     ↓
Manual Comparison
     ↓
Manual Shortlisting
     ↓
Manual Emails
```

TalentIQ provides:

```text
100 Resumes
     ↓
Automated Parsing
     ↓
ATS + AI Screening
     ↓
Candidate Ranking
     ↓
Recruiter Review
     ↓
One-Click Decision
     ↓
Automated Email
```

The recruiter remains the final decision-maker; the system acts as a screening and decision-support tool.

---

# 🎯 Engineering Highlights

This project demonstrates practical experience with:

* Full-stack application architecture
* REST API design
* Next.js App Router
* TypeScript
* FastAPI
* SQLAlchemy ORM
* PostgreSQL
* JWT authentication
* Password hashing
* Dependency injection
* Repository/service architecture
* Resume parsing
* AI integration
* Hybrid scoring systems
* File upload processing
* Automated email delivery
* Database relationships
* Cascade deletion
* Environment-based configuration
* API proxying
* Backend testing
* Cloud deployment

---

# 🚧 Future Improvements

Potential extensions include:

* Recruiter role-based access control
* Candidate self-service portal
* Interview scheduling
* Calendar integration
* Resume version tracking
* Advanced analytics dashboard
* Candidate comparison view
* Custom scoring weights
* Job recommendation engine
* Interview question generation
* Application status tracking
* Email templates
* Background job processing with Celery/Redis
* Object storage for resumes
* Audit logs
* Advanced recruiter search and filtering

---

# 📌 Project Status

**Status: Functional Full-Stack Application**

Implemented:

* [x] Authentication
* [x] JWT authorization
* [x] Job creation
* [x] Job management
* [x] Job deletion
* [x] PostgreSQL integration
* [x] Resume ZIP upload
* [x] Resume parsing
* [x] Candidate analysis
* [x] ATS scoring
* [x] AI scoring
* [x] Candidate ranking
* [x] Skill matching
* [x] Skill evidence
* [x] Recruiter summaries
* [x] Shortlist workflow
* [x] Rejection workflow
* [x] Automated candidate emails
* [x] Backend tests
* [x] Frontend dashboard
* [x] API proxy
* [x] Deployment configuration

---

# 👩‍💻 Author

**Kashish Nayak**

B.Tech — Information Technology
Indira Gandhi Delhi Technical University for Women (IGDTUW)

Interested in:

* Software Engineering
* Full-Stack Development
* Backend Engineering
* System Design
* AI-powered Developer Tools

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.
