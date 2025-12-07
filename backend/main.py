from fastapi import FastAPI, Depends, HTTPException, UploadFile, File as FastAPIFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil
from pathlib import Path

from database import get_db, init_db
from models import User, File
from auth import verify_password, get_password_hash, create_access_token, decode_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

init_db()

def get_current_user(token: str, db: Session):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/signup")
def signup(username: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = get_password_hash(password)
    user = User(username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/upload")
async def upload_file(
    token: str,
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)
    
    user_dir = os.path.join(UPLOAD_DIR, str(user.id))
    Path(user_dir).mkdir(exist_ok=True)
    
    file_path = os.path.join(user_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    db_file = File(filename=file.filename, filepath=file_path, user_id=user.id)
    db.add(db_file)
    db.commit()
    
    return {"message": "File uploaded successfully"}

@app.get("/files")
def list_files(token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    files = db.query(File).filter(File.user_id == user.id).all()
    return [{
        "id": f.id,
        "filename": f.filename,
        "uploaded_at": f.uploaded_at.isoformat()
    } for f in files]

@app.get("/download/{file_id}")
def download_file(file_id: int, token: str, db: Session = Depends(get_db)):
    user = get_current_user(token, db)
    file = db.query(File).filter(File.id == file_id, File.user_id == user.id).first()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file.filepath, filename=file.filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
