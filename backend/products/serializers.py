import json

from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Read serializer — returns absolute image URLs."""
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'price',
            'tag',
            'category',
            'image',
            'description',
            'sizes',
            'details',
            'is_active',
            'created_at',
            'updated_at',
        )

    def get_image(self, product):
        if not product.image:
            return ''
        request = self.context.get('request')
        if request is None:
            return product.image.url
        return request.build_absolute_uri(product.image.url)


class ProductWriteSerializer(serializers.ModelSerializer):
    """Write serializer — used for POST / PUT / PATCH.
    Accepts multipart/form-data so image uploads work.
    sizes and details can be sent as JSON strings when using multipart.
    """

    class Meta:
        model = Product
        fields = (
            'name',
            'price',
            'tag',
            'category',
            'image',
            'description',
            'sizes',
            'details',
            'is_active',
        )

    def _parse_json_field(self, value, field_name):
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if not isinstance(parsed, list):
                    raise serializers.ValidationError(f'{field_name} must be a JSON array.')
                return parsed
            except json.JSONDecodeError:
                raise serializers.ValidationError(f'{field_name} must be a valid JSON array.')
        return value

    def validate_sizes(self, value):
        return self._parse_json_field(value, 'sizes')

    def validate_details(self, value):
        return self._parse_json_field(value, 'details')
