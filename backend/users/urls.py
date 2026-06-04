from django.urls import path

from .views import (
    AcceptInviteAPIView,
    InviteAPIView,
    InviteRevokeAPIView,
    LoginAPIView,
    LogoutAPIView,
    PasswordResetConfirmAPIView,
    PasswordResetRequestAPIView,
    ProfileAPIView,
    StaffListAPIView,
    StaffManageAPIView,
    TokenRefreshAPIView,
)

urlpatterns = [
    path('login/',                    LoginAPIView.as_view(),                name='user_login'),
    path('token/refresh/',            TokenRefreshAPIView.as_view(),         name='token_refresh'),
    path('profile/',                  ProfileAPIView.as_view(),              name='user_profile'),
    path('logout/',                   LogoutAPIView.as_view(),               name='user_logout'),
    path('staff/',                    StaffListAPIView.as_view(),            name='staff_list'),
    path('staff/<int:pk>/',           StaffManageAPIView.as_view(),          name='staff_manage'),
    path('invite/',                   InviteAPIView.as_view(),               name='user_invite'),
    path('invite/<int:pk>/',          InviteRevokeAPIView.as_view(),         name='invite_revoke'),
    path('invite/accept/',            AcceptInviteAPIView.as_view(),         name='invite_accept'),
    path('password-reset/',           PasswordResetRequestAPIView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/',   PasswordResetConfirmAPIView.as_view(), name='password_reset_confirm'),
]
