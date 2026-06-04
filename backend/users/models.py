import uuid
from datetime import timedelta

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class Profile(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')

    def __str__(self):
        return f'{self.user.email} — {self.role}'

    @property
    def can_manage_products(self):
        return self.role in ('owner', 'admin')

    @property
    def can_invite(self):
        return self.role in ('owner', 'admin')


class InviteToken(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]

    token      = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    email      = models.EmailField()
    role       = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_invites')
    is_used    = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Invite → {self.email} ({self.role})'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired


class PasswordResetToken(models.Model):
    token      = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    is_used    = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + timedelta(hours=1)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return not self.is_used and not self.is_expired


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
