from dotenv import load_dotenv

load_dotenv()

from app.services.ai.gemini_analyzer import GeminiAnalyzer


analyzer = GeminiAnalyzer()


resume_text = """
Priya Verma

Frontend Developer

EDUCATION
B.Tech in Information Technology

SKILLS
JavaScript
TypeScript
React
Next.js
HTML
CSS
Tailwind CSS

EXPERIENCE
Frontend Developer Intern
Worked on frontend development for 6 months.

PROJECTS

1. E-Commerce Website
Built an e-commerce frontend using React and
JavaScript.

2. Portfolio Website
Created a responsive portfolio using Next.js
and Tailwind CSS.
"""


job_description = """
Machine Learning Engineer

We are looking for a Machine Learning Engineer.

REQUIRED SKILLS
Python
Machine Learning
Scikit-learn
PyTorch
TensorFlow
AWS
Docker

RESPONSIBILITIES
- Develop machine learning models.
- Train and evaluate ML algorithms.
- Perform data preprocessing.
- Deploy machine learning models.
- Work with cloud infrastructure.

EXPERIENCE
1+ years of machine learning experience preferred.

EDUCATION
Bachelor's degree in Computer Science,
Information Technology, Mathematics,
Statistics, or related field.
"""


result = analyzer.analyze(
    resume_text=resume_text,
    job_description=job_description,
)


print("\n========== GEMINI RESULT ==========\n")

print(result.model_dump_json(indent=2))