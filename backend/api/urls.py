from django.urls import path

from .views import ContactAPIView, DashboardAPIView, HealthAPIView


urlpatterns = [
    path('health/',    HealthAPIView.as_view(),    name='health'),
    path('contact/',   ContactAPIView.as_view(),   name='contact'),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
]
