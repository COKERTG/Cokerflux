from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import InviteToken, Profile


class ProfileInline(admin.StackedInline):
    model  = Profile
    fields = ('role',)
    extra  = 0


admin.site.unregister(User)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    inlines       = [ProfileInline]
    list_display  = ('username', 'email', 'get_role', 'is_active', 'date_joined')
    list_filter   = ('is_active', 'profile__role')
    search_fields = ('username', 'email')

    @admin.display(description='Role')
    def get_role(self, obj):
        try:
            return obj.profile.get_role_display()
        except Profile.DoesNotExist:
            return '—'


@admin.register(InviteToken)
class InviteTokenAdmin(admin.ModelAdmin):
    list_display  = ('email', 'role', 'invited_by', 'is_used', 'is_expired', 'expires_at', 'created_at')
    list_filter   = ('role', 'is_used')
    search_fields = ('email',)
    readonly_fields = ('token', 'invited_by', 'expires_at', 'created_at')

    def has_add_permission(self, request):
        return False
