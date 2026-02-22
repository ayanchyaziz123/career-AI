"""
Career profiles for ML matching.
Skill names must exactly match those in frontend/src/data/mockData.ts
so the frontend merge works correctly.
"""

CAREER_PROFILES = {
    "senior-frontend": {
        "required_skills": {
            "TypeScript":               {"level": 9, "category": "Technical"},
            "React":                    {"level": 9, "category": "Technical"},
            "System Design":            {"level": 8, "category": "Technical"},
            "Team Leadership":          {"level": 7, "category": "Soft Skills"},
            "Performance Optimization": {"level": 8, "category": "Technical"},
            "Accessibility (a11y)":     {"level": 8, "category": "Domain Knowledge"},
        },
        "ideal_experience": 5,
    },
    "ui-ux-engineer": {
        "required_skills": {
            "Figma / Design Tools": {"level": 8, "category": "Technical"},
            "CSS & Animations":     {"level": 9, "category": "Technical"},
            "User Research":        {"level": 7, "category": "Domain Knowledge"},
            "Prototyping":          {"level": 8, "category": "Technical"},
            "Design Systems":       {"level": 8, "category": "Technical"},
            "Communication":        {"level": 8, "category": "Soft Skills"},
        },
        "ideal_experience": 4,
    },
    "fullstack-developer": {
        "required_skills": {
            "Node.js / Backend":         {"level": 8, "category": "Technical"},
            "Databases (SQL/NoSQL)":     {"level": 8, "category": "Technical"},
            "API Design (REST/GraphQL)": {"level": 8, "category": "Technical"},
            "DevOps & CI/CD":            {"level": 7, "category": "Technical"},
            "Cloud Services (AWS/GCP)":  {"level": 7, "category": "Technical"},
            "Problem Solving":           {"level": 8, "category": "Soft Skills"},
        },
        "ideal_experience": 4,
    },
    "devops-engineer": {
        "required_skills": {
            "Linux & Scripting":   {"level": 9, "category": "Technical"},
            "Docker & Kubernetes": {"level": 9, "category": "Technical"},
            "CI/CD Pipelines":     {"level": 8, "category": "Technical"},
            "Cloud Platforms":     {"level": 9, "category": "Technical"},
            "Monitoring & Logging":{"level": 7, "category": "Technical"},
            "Collaboration":       {"level": 8, "category": "Soft Skills"},
        },
        "ideal_experience": 5,
    },
    "data-engineer": {
        "required_skills": {
            "Python":              {"level": 9, "category": "Technical"},
            "SQL & Data Modeling": {"level": 9, "category": "Technical"},
            "ETL / Data Pipelines":{"level": 8, "category": "Technical"},
            "Cloud Data Services": {"level": 8, "category": "Technical"},
            "Spark / Big Data":    {"level": 7, "category": "Technical"},
            "Analytical Thinking": {"level": 8, "category": "Soft Skills"},
        },
        "ideal_experience": 4,
    },
}

EDUCATION_SCORES = {
    "phd":        1.0,
    "masters":    0.9,
    "bachelors":  0.8,
    "associates": 0.75,
    "bootcamp":   0.7,
    "self-taught":0.7,
}

def parse_experience_years(experience_str: str) -> float:
    """Convert experience range string to midpoint float."""
    mapping = {
        "0-2":  1.0,
        "2-5":  3.5,
        "5-10": 7.5,
        "10+":  12.0,
    }
    return mapping.get(experience_str, 3.5)
