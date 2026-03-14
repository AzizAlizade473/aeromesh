"""
Vercel serverless entry point.
Re-exports the FastAPI `app` from main.py so Vercel can find it.
"""
import sys
import os

# Add the backend root to sys.path so all imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from main import app
