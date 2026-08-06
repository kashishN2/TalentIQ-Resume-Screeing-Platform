from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    verify_password,
    decode_access_token,
)

from app.repositories.user_repository import UserRepository


class AuthService:

    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def authenticate_user(
        self,
        email: str,
        password: str,
    ):
        user = self.repo.get_by_email(email)

        if not user:
            return None

        if not verify_password(
            password,
            user.password_hash,
        ):
            return None

        return user

    def login(
        self,
        email: str,
        password: str,
    ):
        user = self.authenticate_user(
            email,
            password,
        )

        if user is None:
            return None

        token = create_access_token(
            subject=user.email,
        )

        return {
            "access_token": token,
            "token_type": "Bearer",
            "user": user,
        }

    # 👇 Step 4 starts here
    def get_current_user(self, token: str):
        payload = decode_access_token(token)

        email = payload.get("sub")

        if email is None:
            return None

        return self.repo.get_by_email(email)