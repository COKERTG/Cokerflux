import logging
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage
from .serializers import ContactMessageSerializer
from products.models import Category, Product
from products.serializers import ProductSerializer
from users.models import InviteToken
from users.serializers import UserSerializer


logger = logging.getLogger(__name__)


class HealthAPIView(APIView):
    def get(self, request):
        return Response({'ok': True, 'service': 'cokerflux-backend'})


class ContactAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        contact_message = ContactMessage.objects.create(**data)
        recipient = getattr(settings, 'CONTACT_RECIPIENT_EMAIL', 'cokerflux.ng@gmail.com')
        subject = f"New Cokerflux contact message from {data['name']}"
        message = (
            f"Name: {data['name']}\n"
            f"Email: {data['email']}\n\n"
            f"Message:\n{data['message']}"
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
        except (OSError, SMTPException) as exc:
            logger.exception('Contact email delivery failed: %s', exc)
            contact_message.email_error = str(exc)
            contact_message.save(update_fields=['email_error'])
            return Response(
                {
                    'message': 'Message received. Email notification could not be sent right now.',
                    'email_sent': False,
                },
                status=status.HTTP_201_CREATED,
            )

        contact_message.email_sent = True
        contact_message.save(update_fields=['email_sent'])
        return Response({'message': 'Message sent successfully.', 'email_sent': True}, status=status.HTTP_201_CREATED)


class DashboardAPIView(APIView):
    """GET /api/dashboard/ — stats for the admin dashboard."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        all_products = Product.objects.all()
        total    = all_products.count()
        active   = all_products.filter(is_active=True).count()
        inactive = total - active

        by_category = {}
        for cat in Category.objects.all():
            by_category[cat.name] = all_products.filter(category=cat.name).count()

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
