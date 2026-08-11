from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.database import Base, SessionLocal, engine
from app.models.user import User


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        existing_user = (
            db.query(User)
            .filter(User.email == settings.DEFAULT_ADMIN_EMAIL)
            .first()
        )

        if existing_user:
            return

        admin = User(
            full_name=settings.DEFAULT_ADMIN_NAME,
            email=settings.DEFAULT_ADMIN_EMAIL,
            password_hash=hash_password(
                settings.DEFAULT_ADMIN_PASSWORD
            ),
            role="ADMIN",
            is_active=True,
        )

        db.add(admin)
        db.commit()

    finally:
        db.close()
