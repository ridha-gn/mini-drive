# Mini Drive

A minimal full-stack file storage application with authentication.

## Features

- User signup and login with JWT authentication
- File upload for PDF, images, and text files
- List all uploaded files
- Download files

## Tech Stack

**Backend**: FastAPI, SQLite, JWT
**Frontend**: React, Vite

## Setup Instructions

### Backend

1. Navigate to the backend directory:
```
   cd backend
```

2. Create a virtual environment:
```
   python -m venv venv
   venv\Scripts\activate
```

3. Install dependencies:
```
   pip install -r requirements.txt
```

4. Run the server:
```
   python main.py
```

The backend will run on http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
```
   cd frontend
```

2. Install dependencies:
```
   npm install
```

3. Run the development server:
```
   npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Create an account using the signup form
3. Login with your credentials
4. Upload files using the upload button
5. View and download your files from the list

## Security Notes

This is a minimal implementation for learning purposes. For production use:
- Change the SECRET_KEY in auth.py
- Add input validation
- Implement file size limits
- Add rate limiting
- Use HTTPS
- Add proper error handling
