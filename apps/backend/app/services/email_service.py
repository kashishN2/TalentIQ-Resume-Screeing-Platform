import smtplib
from email.message import EmailMessage

from app.core.config import settings


class EmailService:

    def __init__(self):
        if not settings.SMTP_USERNAME:
            raise ValueError(
                "SMTP_USERNAME is not configured."
            )

        if not settings.SMTP_PASSWORD:
            raise ValueError(
                "SMTP_PASSWORD is not configured."
            )

    def send_candidate_decision(
        self,
        candidate_email: str,
        candidate_name: str,
        job_title: str,
        decision: str,
    ):

        if decision == "SHORTLIST":

            subject = f"Application Update - {job_title}"

            html = f"""
            <html>
                <body>
                    <h2>Congratulations, {candidate_name}!</h2>

                    <p>
                        We are pleased to inform you that your
                        application for the
                        <strong>{job_title}</strong> position
                        has been shortlisted.
                    </p>

                    <p>
                        Our recruitment team will contact you
                        with the next steps.
                    </p>

                    <p>
                        Best regards,<br>
                        Recruitment Team
                    </p>
                </body>
            </html>
            """

        elif decision == "REJECT":

            subject = f"Application Update - {job_title}"

            html = f"""
            <html>
                <body>
                    <h2>Application Update</h2>

                    <p>
                        Dear {candidate_name},
                    </p>

                    <p>
                        Thank you for your interest in the
                        <strong>{job_title}</strong> position.
                    </p>

                    <p>
                        After reviewing your application,
                        we have decided not to proceed with
                        your application at this time.
                    </p>

                    <p>
                        We appreciate your time and interest.
                    </p>

                    <p>
                        Best regards,<br>
                        Recruitment Team
                    </p>
                </body>
            </html>
            """

        else:
            raise ValueError(
                f"Unsupported decision: {decision}"
            )

        message = EmailMessage()

        message["From"] = settings.SMTP_FROM
        message["To"] = candidate_email
        message["Subject"] = subject

        message.set_content(
            f"Application Update - {job_title}"
        )

        message.add_alternative(
            html,
            subtype="html",
        )

        with smtplib.SMTP(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
        ) as server:

            server.starttls()

            server.login(
                settings.SMTP_USERNAME,
                settings.SMTP_PASSWORD,
            )

            server.send_message(message)

        return {
            "success": True,
            "recipient": candidate_email,
            "subject": subject,
        }