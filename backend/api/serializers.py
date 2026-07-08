from rest_framework import serializers


class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    message = serializers.CharField(max_length=5000, trim_whitespace=True)

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Message must be at least 10 characters.')
        return value
