from django.conf import settings
from django.http import HttpResponse


class LocalCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'OPTIONS':
            response = HttpResponse(status=200)
        else:
            response = self.get_response(request)

        response['Access-Control-Allow-Origin'] = settings.FRONTEND_URL
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response['Access-Control-Allow-Credentials'] = 'true'
        return response
