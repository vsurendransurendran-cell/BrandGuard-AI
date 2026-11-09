
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import guidelines, submissions, issues, reviews

app = FastAPI(
    title="VINSYREX Brand Governance API",
    description="AI-powered brand compliance and governance platform",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guidelines.router)
app.include_router(submissions.router)
app.include_router(issues.router)
app.include_router(reviews.router)


@app.get("/")
async def root():
    return {
        "message": "VINSYREX Brand Governance API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "VINSYREX Backend"
    }
