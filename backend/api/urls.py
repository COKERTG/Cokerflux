from django.urls import path

from .views import (
    ContactAPIView, DashboardAPIView, DetectLocationAPIView, HealthAPIView,
    StoreSettingsAPIView,
)


urlpatterns = [
    path('health/',          HealthAPIView.as_view(),         name='health'),
    path('detect-location/', DetectLocationAPIView.as_view(), name='detect-location'),
    path('contact/',         ContactAPIView.as_view(),        name='contact'),
    path('dashboard/',       DashboardAPIView.as_view(),      name='dashboard'),
    path('settings/',        StoreSettingsAPIView.as_view(),  name='settings'),
]
