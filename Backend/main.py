from fastapi import FastAPI
import joblib
from pathlib import Path
from pydantic import BaseModel
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory where main.py is located
BASE_DIR = Path(__file__).resolve().parent

# Load the trained ML pipeline
model = joblib.load(BASE_DIR / "fake_job_detector.pkl")

# Our selected classification threshold
THRESHOLD = 0.3


@app.get("/")
def home():
    return {"message": "Fake Job Detector API is running"}

class JobPosting(BaseModel):
    text: str
    required_education: str = "Unknown"
    required_experience: str = "Unknown"
    function: str = "Unknown"
    industry: str = "Unknown"
    employment_type: str = "Unknown"
    telecommuting: int = 0
    has_questions: int = 0
    has_company_logo: int = 0

@app.post("/predict")
def predict(job: JobPosting):

    data = pd.DataFrame([job.model_dump()])

    probability = model.predict_proba(data)[0][1]

    #  threshold
    threshold = 0.3

    prediction = int(probability >= threshold)

    if probability < 0.20:
        risk_level = "Low"
    elif probability < 0.50:
        risk_level = "Moderate"
    elif probability < 0.75:
        risk_level = "High"
    else:
        risk_level = "Very High"

    return {
    "fraud_probability": round(float(probability), 4),
    "fraud_percentage": round(float(probability) * 100, 2),
    "prediction": prediction,
    "risk_level": risk_level,
    "result": "Potential Fraudulent Job" if prediction == 1 else "Likely Genuine Job"
    }
    
