import re

from rest_framework import serializers

from .models import StoreSettings


# 7–15 digits, optional leading +. Empty is allowed (a market may have no number yet).
WHATSAPP_RE = re.compile(r'^\+?\d{7,15}$')


class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSettings
        fields = ('whatsapp_number_ng', 'whatsapp_number_gh')

    def _validate_number(self, value):
        value = (value or '').strip()
        if value and not WHATSAPP_RE.match(value.replace(' ', '')):
            raise serializers.ValidationError('Enter a valid international number, e.g. +2347045036178.')
        return value

    def validate_whatsapp_number_ng(self, value):
        return self._validate_number(value)

    def validate_whatsapp_number_gh(self, value):
        return self._validate_number(value)


class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    message = serializers.CharField(max_length=5000, trim_whitespace=True)

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Message must be at least 10 characters.')
        return value
