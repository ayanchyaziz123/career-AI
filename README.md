# Career Pathfinder — AI-Powered Career Matching & Skill Gap Analysis

A full-stack web application that uses machine learning to match users with career paths based on their skills, experience, and education. Built with React (TypeScript) + Django (Python) + scikit-learn.

**Live URL:** https://pg2grgjp3j.us-east-2.awsapprunner.com

---

## Features

- **ML Career Matching** — cosine similarity algorithm ranks 5 career profiles against your skill set
- **Skill Gap Analysis** — per-skill gap visualization with interactive self-assessment sliders
- **Learning Roadmaps** — 3-phase timeline (Foundation → Intermediate → Advanced) per career
- **Resource Recommendations** — curated courses/certifications filtered by skill gaps
- **Career Comparison** — side-by-side comparison of up to 3 careers
- **Dashboard** — progress rings, saved careers, overall readiness score

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, React Router v7 |
| Backend | Django 5, Django REST Framework |
| ML | scikit-learn (cosine similarity), NumPy |
| Deployment | AWS App Runner, Amazon ECR, Docker, nginx |

---

## Project Structure

```
career-ai/
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Profile input form
│   │   │   ├── ResultsPage.tsx     # Career match cards
│   │   │   ├── CareerDetailPage.tsx# Skill gaps + roadmap + resources
│   │   │   ├── ComparePage.tsx     # Side-by-side comparison
│   │   │   └── DashboardPage.tsx   # Progress overview
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── context/
│   │   │   └── CareerContext.tsx   # Global state
│   │   └── data/
│   │       └── mockData.ts         # Static career data (salary, roadmaps, resources)
│   ├── Dockerfile                  # Multi-stage: node build → nginx serve
│   ├── nginx.conf                  # SPA routing + gzip + asset caching
│   └── tailwind.config.js
│
└── backend/                    # Django REST API
    ├── api/
    │   ├── ml/
    │   │   ├── career_data.py      # 5 career profiles with skill requirements
    │   │   └── matcher.py          # CareerMatcher — cosine similarity ML
    │   ├── views.py                # POST /api/analyze/
    │   └── urls.py
    ├── career_ai/
    │   ├── settings.py             # CORS, installed apps
    │   └── urls.py
    └── requirements.txt
```

---

## ML Algorithm

For each of 5 career profiles, two vectors are built over the career's skill vocabulary:

```
user_vec[i]    = 0.6  if user listed this skill, else 0.0
career_vec[i]  = required_level / 10.0

sim         = cosine_similarity(user_vec, career_vec)       # 0–1
exp_factor  = min(user_experience / ideal_experience, 1.0)  # 0–1
edu_factor  = { phd: 1.0, masters: 0.9, bachelors: 0.8,
                associates: 0.75, bootcamp: 0.7, self-taught: 0.7 }

raw_score   = sim × 0.70 + exp_factor × 0.20 + edu_factor × 0.10
match_score = clamp(round(raw_score × 100), 40, 95)
```

The frontend merges ML-computed `matchScore` and per-skill levels with static data (salary, roadmap, resources) from `mockData.ts`. If the backend is unreachable, it falls back to static mock data automatically.

---

## Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
# → http://localhost:8000
```

Test the API:
```bash
curl -X POST http://localhost:8000/api/analyze/ \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "TypeScript", "CSS & Animations"],
    "experience": "2-5",
    "education": "bachelors",
    "interests": "frontend development",
    "workStyle": "hybrid"
  }'
```

### Frontend

```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

With both running, the frontend calls the backend ML API. Without the backend, it uses mock data as a fallback.

---

## API Reference

### `POST /api/analyze/`

**Request body:**
```json
{
  "skills":     ["React", "TypeScript"],
  "experience": "2-5",
  "education":  "bachelors",
  "interests":  "web development",
  "workStyle":  "hybrid"
}
```

**Response:**
```json
{
  "careers": [
    {
      "id": "senior-frontend",
      "matchScore": 78,
      "skills": [
        { "name": "React", "level": 6, "required": 9, "category": "Technical" },
        { "name": "TypeScript", "level": 6, "required": 9, "category": "Technical" }
      ]
    }
  ]
}
```

Careers are sorted by `matchScore` descending. `level` = 6 if user listed the skill, 0 if not (adjustable via frontend sliders).

---

## Deployment

### Frontend (AWS App Runner via Docker)

```bash
# Build image
cd frontend
docker build --platform linux/amd64 -t career-ai-frontend:latest .

# Push to ECR
aws ecr get-login-password --region us-east-2 | \
  docker login --username AWS --password-stdin \
  898182087492.dkr.ecr.us-east-2.amazonaws.com

docker tag career-ai-frontend:latest \
  898182087492.dkr.ecr.us-east-2.amazonaws.com/career-ai-frontend:latest

docker push \
  898182087492.dkr.ecr.us-east-2.amazonaws.com/career-ai-frontend:latest

# Trigger App Runner redeployment
aws apprunner start-deployment \
  --service-arn arn:aws:apprunner:us-east-2:898182087492:service/career-ai-frontend/2398f90c93c54b51a8d3285cbbf6144c \
  --region us-east-2
```

### AWS Resources

| Resource | Details |
|----------|---------|
| ECR Repository | `898182087492.dkr.ecr.us-east-2.amazonaws.com/career-ai-frontend` |
| App Runner Service | `career-ai-frontend` — `us-east-2` |
| Instance | 0.25 vCPU / 0.5 GB |
| Port | 8080 (nginx) |

---

## Career Profiles

| ID | Title | Ideal Experience |
|----|-------|-----------------|
| `senior-frontend` | Senior Frontend Developer | 5 years |
| `ui-ux-engineer` | UI/UX Engineer | 4 years |
| `fullstack-developer` | Full Stack Developer | 4 years |
| `devops-engineer` | DevOps Engineer | 5 years |
| `data-engineer` | Data Engineer | 4 years |
