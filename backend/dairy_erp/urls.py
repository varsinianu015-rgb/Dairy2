from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import JsonResponse





def home(request):
    return JsonResponse({
        "app": "Dairy ERP Backend",
        "status": "running",
        "message": "Backend API is working successfully",
        "available_routes": {
            "admin": "/admin/",
            "health": "/health/",
            "api": "/api/"
        }
    })


def health(request):
    return JsonResponse({
        "status": "healthy",
        "database": "connected"
    })



urlpatterns = [
    path("admin/", admin.site.urls),
    path("", home, name="home"),
    path("health/", health, name="health"),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("erp.urls")),
]
