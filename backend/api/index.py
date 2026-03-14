"""
Vercel serverless entry point.
Re-exports the FastAPI `app` from backend/main.py so Vercel can find it.
"""
import sys
import os

# Add the backend directory to sys.path so all imports work
backend_dir = os.path.join(os.path.dirname(__file__), "..")
sys.path.insert(0, backend_dir)

from main import app  # noqa: E402, F401
