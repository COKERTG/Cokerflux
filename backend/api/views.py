import ipaddress
import json
import logging
import urllib.request
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage, StoreSettings
from .serializers import ContactMessageSerializer, StoreSettingsSerializer
from products.models import Category, Product
from products.serializers import ProductSerializer
from users.models import InviteToken
from users.permissions import IsOwnerOrAdmin
from users.serializers import UserSerializer


logger = logging.getLogger(__name__)


class HealthAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'ok': True, 'service': 'cokerflux-backend'})


class StoreSettingsAPIView(APIView):
    """Store-wide settings (WhatsApp numbers).

    GET   /api/settings/ — public, read by the storefront checkout.
    PATCH /api/settings/ — owner/admin only, edited from the admin panel.
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsOwnerOrAdmin()]

    def get(self, request):
        return Response(StoreSettingsSerializer(StoreSettings.load()).data)

    def patch(self, request):
        serializer = StoreSettingsSerializer(StoreSettings.load(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DetectLocationAPIView(APIView):
    """GET /api/detect-location/ — resolve the visitor's country from their IP
    (server-side, so no geolocation API key is exposed to the browser) and map it
    to a display currency. Never errors out: any failure falls back to the default.
    """
    permission_classes = [AllowAny]

    CURRENCY_BY_COUNTRY = {'NG': 'NGN', 'GH': 'GHS'}
    DEFAULT_CURRENCY = 'NGN'  # anywhere outside NG/GH sees NGN pricing

    def get(self, request):
        ip = self._client_ip(request)
        country_code = None
        if ip and not self._is_private(ip):
            country_code = self._lookup_country(ip)

        currency = self.CURRENCY_BY_COUNTRY.get(country_code, self.DEFAULT_CURRENCY)
        return Response({
            'ip': ip,
            'country_code': country_code,
            'currency': currency,
        })

    @staticmethod
    def _client_ip(request):
        # Behind a proxy/CDN the real client is the first hop in X-Forwarded-For.
        forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '').strip()

    @staticmethod
    def _is_private(ip):
        # localhost / LAN addresses can't be geolocated (e.g. in dev) — skip the lookup.
        try:
            addr = ipaddress.ip_address(ip)
            return addr.is_private or addr.is_loopback
        except ValueError:
            return True

    @staticmethod
    def _lookup_country(ip):
        url = f'http://ip-api.com/json/{ip}?fields=status,countryCode'
        try:
            with urllib.request.urlopen(url, timeout=3) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            if data.get('status') == 'success':
                return data.get('countryCode')
        except Exception as exc:  # network error, timeout, bad JSON — non-fatal
            logger.warning('IP geolocation lookup failed for %s: %s', ip, exc)
        return None


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
