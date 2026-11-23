# 🛡️ ScamShield
### AI-Powered Fake Job Posting Detection System

ScamShield is an NLP and machine learning based web application designed to analyze job postings and identify potentially fraudulent recruitment opportunities. It analyzes job description text and other job-related attributes to estimate the likelihood of a posting being fraudulent.

---

## 🚀 Features

- Fraud probability scoring
- Risk classification (Low, Moderate, High, Very High)
- NLP-based text analysis
- Job posting classification using Machine Learning
- Interactive web interface
- REST API powered by FastAPI
- Real-time prediction results
- Custom risk threshold for fraud detection

---

## 🧠 Machine Learning Approach

ScamShield uses a supervised machine learning pipeline built using Scikit-learn.

### Text preprocessing and feature extraction
- CountVectorizer
- Maximum features: 5,000
- Unigrams and bigrams
- English stop-word removal

### Categorical feature processing
- OneHotEncoder
- Handle unknown categories

### Model
- Logistic Regression

### Pipeline
The preprocessing and classification steps are combined using a Scikit-learn Pipeline and ColumnTransformer.

---
## 📊 Model Evaluation

Evaluated on a held-out test dataset.

| Metric | Score |
|---|---:|
| Accuracy | 97.51% |
| Fraud Precision | 86.84% |
| Fraud Recall | 57.23% |
| Fraud F1-score | 68.99% |

The model uses a probability threshold of **0.30** to flag potentially fraudulent job postings.

> Accuracy alone can be misleading because the dataset is imbalanced. Fraud recall and precision are particularly important when evaluating this project.

---

## 🛠️ Tech Stack

**Machine Learning**
- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib

**Backend**
- FastAPI
- Uvicorn

**Frontend**
- HTML5
- CSS3
- JavaScript

---

## 🏗️ Project Architecture

```text
User
 │
 ▼
Frontend (HTML, CSS, JavaScript)
 │
 ▼
FastAPI REST API
 │
 ▼
ML Pipeline
 │
 ├── CountVectorizer
 ├── OneHotEncoder
 └── Numeric Features
 │
 ▼
Logistic Regression
 │
 ▼
Fraud Probability & Risk Classification
```

---

## 📁 Project Structure

```text
ScamShield/
│
├── Backend/
│   ├── main.py
│   ├── fake_job_detector.pkl
│   └── requirements.txt
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── Screenshots/
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ScamShield.git
cd ScamShield
```

### 2. Set up the backend

```bash
cd Backend
python -m venv venv
```

Activate the environment:

**Windows**
```bash
venv\Scripts\activate
```

**Mac/Linux**
```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the FastAPI server

```bash
uvicorn main:app --reload
```

API will be available at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

### 5. Run the frontend

Open `Frontend/index.html` using VS Code Live Server.

---

## ⚠️ Limitations

- Predictions are based on patterns learned from the training dataset.
- Unseen scam patterns may not be identified accurately.
- Fraud probability is a model estimate, not a guarantee.
- A low fraud score does not guarantee that a job posting is legitimate.
- The model may produce false positives and false negatives.

ScamShield should be used as a screening tool, not as a substitute for independent verification.

---

## 🔮 Future Improvements

- Improved fraud detection recall
- TF-IDF and advanced NLP feature comparison
- Transformer-based NLP models
- Explainable AI for highlighting suspicious text
- Database integration for analysis history
- Cloud deployment
- Improved fraud pattern detection

---

## 👨‍💻 Author

**Akshat Namdeo**

B.Tech Computer Science & Engineering

---


