from rest_framework.permissions import BasePermission


class IsOwnerOrAdmin(BasePermission):
    """Allows access only to users whose profile role is 'owner' or 'admin'."""

    message = 'You do not have permission to perform this action.'

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.profile.can_manage_products
        except Exception:
            return False
