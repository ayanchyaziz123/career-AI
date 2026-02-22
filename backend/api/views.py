import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .ml.matcher import CareerMatcher

matcher = CareerMatcher()


@method_decorator(csrf_exempt, name="dispatch")
class AnalyzeView(View):

    def post(self, request):
        try:
            body = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        skills = body.get("skills", [])
        experience = body.get("experience", "2-5")
        education = body.get("education", "bachelors")

        if not isinstance(skills, list):
            return JsonResponse({"error": "'skills' must be a list"}, status=400)

        careers = matcher.match(
            skills=skills,
            experience=experience,
            education=education,
        )

        return JsonResponse({"careers": careers})

    def get(self, request):
        return JsonResponse({"status": "Career AI backend running"})
