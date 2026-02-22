"""
Career matching using scikit-learn cosine similarity.

Algorithm:
  For each career, build two vectors over the career's skill vocabulary:
    user_vec[i]   = 0.6 if the user listed this skill, else 0.0
    career_vec[i] = required_level / 10.0

  sim = cosine_similarity(user_vec, career_vec)   # 0–1
  exp_factor = min(user_exp / ideal_exp, 1.0)     # 0–1
  edu_factor = education score map                 # 0.7–1.0

  raw_score = sim * 0.70 + exp_factor * 0.20 + edu_factor * 0.10
  match_score = clamp(round(raw_score * 100), 40, 95)
"""

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from .career_data import CAREER_PROFILES, EDUCATION_SCORES, parse_experience_years


class CareerMatcher:

    def match(self, skills: list, experience: str, education: str) -> list:
        """
        Compute ML match scores for all career profiles.

        Args:
            skills:     List of skill name strings the user has.
            experience: Experience range string e.g. "2-5".
            education:  Education level key e.g. "bachelors".

        Returns:
            List of dicts sorted by matchScore descending:
            [{id, matchScore, skills: [{name, level, required, category}]}]
        """
        user_skills_normalized = {s.strip().lower() for s in skills}
        exp_years = parse_experience_years(experience)
        edu_factor = EDUCATION_SCORES.get(education, 0.75)

        results = []

        for career_id, profile in CAREER_PROFILES.items():
            req_skills = profile["required_skills"]
            ideal_exp = profile["ideal_experience"]

            skill_names = list(req_skills.keys())

            # Build vectors
            user_vec = np.array([
                0.6 if name.lower() in user_skills_normalized else 0.0
                for name in skill_names
            ])
            career_vec = np.array([
                req_skills[name]["level"] / 10.0
                for name in skill_names
            ])

            # Cosine similarity (handle zero vector case)
            if user_vec.sum() == 0:
                sim = 0.0
            else:
                sim = float(cosine_similarity([user_vec], [career_vec])[0][0])

            exp_factor = min(exp_years / ideal_exp, 1.0)

            raw = sim * 0.70 + exp_factor * 0.20 + edu_factor * 0.10
            match_score = int(max(40, min(95, round(raw * 100))))

            # Per-skill data: level = 6 if user has it, else 0
            skills_out = [
                {
                    "name": name,
                    "level": 6 if name.lower() in user_skills_normalized else 0,
                    "required": info["level"],
                    "category": info["category"],
                }
                for name, info in req_skills.items()
            ]

            results.append({
                "id": career_id,
                "matchScore": match_score,
                "skills": skills_out,
            })

        return sorted(results, key=lambda x: x["matchScore"], reverse=True)
