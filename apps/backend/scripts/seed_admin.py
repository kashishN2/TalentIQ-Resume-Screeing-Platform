from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.database import SessionLocal
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


def seed_admin():
    db: Session = SessionLocal()

    try:
        repo = UserRepository(db)

        existing_admin = repo.get_by_email(
            settings.DEFAULT_ADMIN_EMAIL
        )

        if existing_admin:
            print("✅ Admin already exists.")
            return

        admin = User(
            full_name=settings.DEFAULT_ADMIN_NAME,
            email=settings.DEFAULT_ADMIN_EMAIL,
            password_hash=hash_password(
                settings.DEFAULT_ADMIN_PASSWORD
            ),
            role=UserRole.ADMIN,
            is_active=True,
        )

        repo.create(admin)

        print("✅ Admin created successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()