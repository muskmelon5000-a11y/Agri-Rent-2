from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_db
from auth_utils import decode_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_db)
) -> dict:
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

    user_ref = db.collection("users").document(user_id)
    user_doc = user_ref.get()
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_doc.to_dict()
    user_data["id"] = user_doc.id
    return user_data


def require_provider(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "provider":
        raise HTTPException(status_code=403, detail="Provider access required")
    return current_user


def require_seeker(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user.get("role") != "seeker":
        raise HTTPException(status_code=403, detail="Seeker access required")
    return current_user
