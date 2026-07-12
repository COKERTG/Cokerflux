from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import InviteToken, PasswordResetToken


def _run_password_validators(value):
    """Run Django's AUTH_PASSWORD_VALIDATORS and re-raise as a DRF error so the
    configured strength rules are enforced wherever a password is set."""
    try:
        validate_password(value)
    except DjangoValidationError as e:
        raise serializers.ValidationError(list(e.messages))
    return value


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model  = User
        fields = ('id', 'username', 'email', 'role', 'is_active', 'date_joined', 'last_login')


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid username or password.')
        if not user.is_active:
            raise serializers.ValidationError('This account has been disabled.')
        data['user'] = user
        return data


class InviteSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role  = serializers.ChoiceField(choices=['admin', 'staff'])

    def validate_email(self, value):
        email = value.lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        if InviteToken.objects.filter(email__iexact=email, is_used=False).exists():
            raise serializers.ValidationError('An active invite for this email already exists.')
        return email

    def validate(self, data):
        request = self.context['request']
        inviter_role = request.user.profile.role

        # Admin can only invite staff — not other admins
        if inviter_role == 'admin' and data['role'] == 'admin':
            raise serializers.ValidationError({'role': 'Admins can only invite staff members.'})
        return data


class AcceptInviteSerializer(serializers.Serializer):
    token    = serializers.UUIDField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_token(self, value):
        try:
            invite = InviteToken.objects.get(token=value)
        except InviteToken.DoesNotExist:
            raise serializers.ValidationError('Invalid invite token.')
        if not invite.is_valid:
            raise serializers.ValidationError('This invite has expired or already been used.')
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def validate_password(self, value):
        return _run_password_validators(value)


class InviteListSerializer(serializers.ModelSerializer):
    invited_by = serializers.CharField(source='invited_by.username', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model  = InviteToken
        fields = ('id', 'email', 'role', 'invited_by', 'is_used', 'is_expired', 'expires_at', 'created_at')


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token    = serializers.UUIDField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_token(self, value):
        try:
            reset_token = PasswordResetToken.objects.get(token=value)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError('Invalid or expired reset link.')
        if not reset_token.is_valid:
            raise serializers.ValidationError('This reset link has expired or already been used.')
        return value

    def validate_password(self, value):
        return _run_password_validators(value)
