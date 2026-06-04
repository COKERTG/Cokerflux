from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from products.models import Product
from products.serializers import ProductSerializer
from users.models import InviteToken
from users.serializers import UserSerializer


class HealthAPIView(APIView):
    def get(self, request):
        return Response({'ok': True, 'service': 'cokerflux-backend'})


class DashboardAPIView(APIView):
    """GET /api/dashboard/ — stats for the admin dashboard."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_products = Product.objects.all()
        total    = all_products.count()
        active   = all_products.filter(is_active=True).count()
        inactive = total - active

        by_category = {}
        for cat, _ in Product.CATEGORY_CHOICES:
            by_category[cat] = all_products.filter(category=cat).count()

        recent = all_products.order_by('-created_at')[:5]
        recent_data = ProductSerializer(recent, many=True, context={'request': request}).data

        data = {
            'products': {
                'total':       total,
                'active':      active,
                'inactive':    inactive,
                'by_category': by_category,
                'recent':      recent_data,
            },
        }

        is_manager = hasattr(request.user, 'profile') and request.user.profile.role in ('owner', 'admin')
        if is_manager:
            from django.contrib.auth.models import User as DjangoUser
            staff_count    = DjangoUser.objects.filter(is_active=True).count()
            pending_invites = InviteToken.objects.filter(is_used=False, expires_at__gt=timezone.now()).count()
            data['staff'] = {
                'total':           staff_count,
                'pending_invites': pending_invites,
            }

        return Response(data)
