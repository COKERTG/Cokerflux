import uuid

from django.conf import settings
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import InviteToken, PasswordResetToken
from .permissions import IsOwnerOrAdmin
from .serializers import (
    AcceptInviteSerializer,
    InviteListSerializer,
    InviteSerializer,
    LoginSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    UserSerializer,
)


def _tokens_for(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


class LoginAPIView(APIView):
    """POST /api/users/login/"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        return Response({'user': UserSerializer(user).data, 'tokens': _tokens_for(user)})


class TokenRefreshAPIView(APIView):
    """POST /api/users/token/refresh/"""
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('refresh')
        if not token:
            return Response({'error': 'refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            refresh = RefreshToken(token)
            return Response({'access': str(refresh.access_token)})
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileAPIView(APIView):
    """GET /api/users/profile/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'user': UserSerializer(request.user).data})


class LogoutAPIView(APIView):
    """POST /api/users/logout/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('refresh')
        if not token:
            return Response({'error': 'refresh token required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(token).blacklist()
        except TokenError:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)


class InviteAPIView(APIView):
    """
    GET  /api/users/invite/ — list all sent invites (owner/admin only)
    POST /api/users/invite/ — send a new invite email (owner/admin only)
    """
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request):
        invites = InviteToken.objects.select_related('invited_by').all()
        serializer = InviteListSerializer(invites, many=True)
        return Response({'invites': serializer.data})

    def post(self, request):
        serializer = InviteSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        role  = serializer.validated_data['role']

        token      = uuid.uuid4()
        accept_url = f"{settings.FRONTEND_URL}/invite/accept/?token={token}"

        send_mail(
            subject="You've been invited to Cokerflux",
            message=(
                f"Hi,\n\n"
                f"{request.user.username} has invited you to join Cokerflux as {role}.\n\n"
                f"Click the link below to set up your account (expires in 7 days):\n"
                f"{accept_url}\n\n"
                f"If you didn't expect this, you can ignore this email.\n\n"
                f"— Cokerflux Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        invite = InviteToken.objects.create(
            token=token,
            email=email,
            role=role,
            invited_by=request.user,
        )

        return Response(
            {'message': f'Invite sent to {email}', 'invite': InviteListSerializer(invite).data},
            status=status.HTTP_201_CREATED,
        )


class StaffListAPIView(APIView):
    """GET /api/users/staff/ — list all users with their roles."""
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request):
        users = User.objects.select_related('profile').filter(is_active=True).order_by('date_joined')
        serializer = UserSerializer(users, many=True)
        pending = InviteToken.objects.filter(is_used=False, expires_at__gt=timezone.now()).count()
        return Response({'staff': serializer.data, 'pending_invites': pending})


class AcceptInviteAPIView(APIView):
    """POST /api/users/invite/accept/ — create account from invite token."""
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = AcceptInviteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            invite = InviteToken.objects.select_for_update().get(token=serializer.validated_data['token'])
        except InviteToken.DoesNotExist:
            return Response({'errors': {'token': ['Invalid invite token.']}}, status=status.HTTP_400_BAD_REQUEST)

        if not invite.is_valid:
            return Response({'errors': {'token': ['This invite has expired or already been used.']}}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=invite.email,
            password=serializer.validated_data['password'],
        )
        user.profile.role = invite.role
        user.profile.save()

        invite.is_used = True
        invite.save()

        return Response(
            {'user': UserSerializer(user).data, 'tokens': _tokens_for(user)},
            status=status.HTTP_201_CREATED,
        )


class StaffManageAPIView(APIView):
    """
    PATCH  /api/users/staff/<pk>/ — toggle active or change role
    DELETE /api/users/staff/<pk>/ — permanently remove account
    """
    permission_classes = [IsOwnerOrAdmin]

    def _get_target(self, request, pk):
        try:
            target = User.objects.select_related('profile').get(pk=pk)
        except User.DoesNotExist:
            return None, Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        if target == request.user:
            return None, Response({'error': "You cannot modify your own account."}, status=status.HTTP_400_BAD_REQUEST)
        if target.profile.role == 'owner':
            return None, Response({'error': 'Owner accounts cannot be modified.'}, status=status.HTTP_403_FORBIDDEN)
        if request.user.profile.role == 'admin' and target.profile.role != 'staff':
            return None, Response({'error': 'Admins can only manage staff members.'}, status=status.HTTP_403_FORBIDDEN)
        return target, None

    def patch(self, request, pk):
        target, err = self._get_target(request, pk)
        if err:
            return err

        if 'is_active' in request.data:
            target.is_active = bool(request.data['is_active'])
            target.save(update_fields=['is_active'])

        if 'role' in request.data:
            new_role = request.data['role']
            if new_role not in ('admin', 'staff'):
                return Response({'error': 'Role must be admin or staff.'}, status=status.HTTP_400_BAD_REQUEST)
            if request.user.profile.role == 'admin' and new_role == 'admin':
                return Response({'error': 'Admins cannot promote to admin.'}, status=status.HTTP_403_FORBIDDEN)
            target.profile.role = new_role
            target.profile.save(update_fields=['role'])

        return Response({'user': UserSerializer(target).data})

    def delete(self, request, pk):
        target, err = self._get_target(request, pk)
        if err:
            return err
        target.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InviteRevokeAPIView(APIView):
    """DELETE /api/users/invite/<pk>/ — cancel a pending invite."""
    permission_classes = [IsOwnerOrAdmin]

    def delete(self, request, pk):
        try:
            invite = InviteToken.objects.get(pk=pk)
        except InviteToken.DoesNotExist:
            return Response({'error': 'Invite not found.'}, status=status.HTTP_404_NOT_FOUND)
        if invite.is_used:
            return Response({'error': 'This invite has already been accepted.'}, status=status.HTTP_400_BAD_REQUEST)
        invite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordResetRequestAPIView(APIView):
    """POST /api/users/password-reset/ — send password reset email."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email__iexact=email, is_active=True)
            # Invalidate any existing unused tokens
            PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)

            reset_token = PasswordResetToken.objects.create(user=user)
            reset_url = f"{settings.FRONTEND_URL}/admin/reset-password/?token={reset_token.token}"

            plain = (
                f"Hi {user.username},\n\n"
                f"We received a request to reset your Cokerflux password.\n\n"
                f"Click the link below to set a new password (expires in 1 hour):\n"
                f"{reset_url}\n\n"
                f"If you didn't request this, you can safely ignore this email.\n\n"
                f"— Cokerflux Team"
            )

            html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:40px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.3em;color:#555;text-transform:uppercase;">
                COKERFLUX
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#141414;border:1px solid #222;padding:48px 40px;">

              <!-- Heading -->
              <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.3em;color:#555;text-transform:uppercase;">
                Account Recovery
              </p>
              <h1 style="margin:0 0 24px;font-size:28px;font-weight:700;letter-spacing:0.02em;color:#f0f0f0;line-height:1.2;">
                Reset Your Password
              </h1>

              <!-- Body -->
              <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.7;letter-spacing:0.02em;">
                Hi <strong style="color:#bbb;">{user.username}</strong>,
              </p>
              <p style="margin:0 0 32px;font-size:13px;color:#888;line-height:1.7;letter-spacing:0.02em;">
                We received a request to reset your Cokerflux password. Click the button below to choose a new one. This link expires in <strong style="color:#bbb;">1 hour</strong>.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#f0f0f0;">
                    <a href="{reset_url}"
                       style="display:inline-block;padding:14px 32px;font-size:11px;font-weight:700;letter-spacing:0.25em;color:#0d0d0d;text-decoration:none;text-transform:uppercase;">
                      Set New Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 4px;font-size:11px;color:#444;letter-spacing:0.02em;">
                Button not working? Copy and paste this link:
              </p>
              <p style="margin:0 0 32px;font-size:11px;color:#555;word-break:break-all;letter-spacing:0.01em;">
                <a href="{reset_url}" style="color:#666;text-decoration:underline;">{reset_url}</a>
              </p>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #222;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <!-- Security note -->
              <p style="margin:0;font-size:11px;color:#444;line-height:1.7;letter-spacing:0.02em;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not change.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;">
              <p style="margin:0;font-size:10px;color:#333;letter-spacing:0.08em;text-transform:uppercase;">
                &copy; Cokerflux &mdash; Internal use only
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

            send_mail(
                subject="Reset your Cokerflux password",
                message=plain,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html,
            )
        except User.DoesNotExist:
            pass  # Silently succeed to prevent email enumeration

        return Response({'message': 'If that email is registered, you will receive a reset link shortly.'})


class PasswordResetConfirmAPIView(APIView):
    """POST /api/users/password-reset/confirm/ — set new password via token."""
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_token = PasswordResetToken.objects.select_for_update().get(token=serializer.validated_data['token'])
        except PasswordResetToken.DoesNotExist:
            return Response({'errors': {'token': ['Invalid or expired reset link.']}}, status=status.HTTP_400_BAD_REQUEST)

        if not reset_token.is_valid:
            return Response({'errors': {'token': ['This reset link has expired or already been used.']}}, status=status.HTTP_400_BAD_REQUEST)

        user = reset_token.user
        user.set_password(serializer.validated_data['password'])
        user.save()

        reset_token.is_used = True
        reset_token.save()

        return Response({'message': 'Password has been reset successfully.'})
