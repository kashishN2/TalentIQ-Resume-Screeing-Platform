from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.dependencies import (
    get_auth_service,
    get_current_user,
)

from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    UserResponse,
)


from app.services.auth_service import AuthService
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)
@router.post("/login", response_model=LoginResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
):
    result = auth_service.login(
        form_data.username,  # email
        form_data.password,
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return result
@router.get(
    "/me",
    response_model=UserResponse,
)
def me(
    current_user=Depends(get_current_user),
):
    return current_user