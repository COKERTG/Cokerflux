from django.urls import path

from .views import DashboardAPIView, HealthAPIView


urlpatterns = [
    path('health/',    HealthAPIView.as_view(),    name='health'),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
]
