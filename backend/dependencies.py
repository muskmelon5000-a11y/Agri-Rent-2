from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from auth_utils import decode_token
import models

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def require_provider(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != "provider":
        raise HTTPException(status_code=403, detail="Provider access required")
    return current_user


def require_seeker(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != "seeker":
        raise HTTPException(status_code=403, detail="Seeker access required")
    return current_user
