import json

from rest_framework import serializers

from .models import Category, Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ('id', 'url', 'order', 'is_primary')

    def get_url(self, obj):
        if not obj.image:
            return ''
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'is_active', 'created_at', 'product_count')
        read_only_fields = ('id', 'created_at', 'product_count')

    def get_product_count(self, obj):
        return Product.objects.filter(category=obj.name).count()

    def validate_name(self, value):
        return value.strip()


class ProductSerializer(serializers.ModelSerializer):
    """Read serializer. Returns `images[]` plus a backward-compat `image` (primary URL)."""
    images = ProductImageSerializer(many=True, read_only=True)
    image  = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'price',
            'tag',
            'category',
            'image',
            'images',
            'description',
            'sizes',
            'details',
            'is_active',
            'created_at',
            'updated_at',
        )

    def get_image(self, product):
        primary = product.images.filter(is_primary=True).first() or product.images.first()
        if not primary:
            return ''
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(primary.image.url)
        return primary.image.url


class ProductWriteSerializer(serializers.ModelSerializer):
    """Write serializer — used for POST / PUT / PATCH.
    Images are managed separately via /products/<id>/images/ endpoints.
    sizes and details can be sent as JSON strings when using multipart.
    """

    class Meta:
        model = Product
        fields = (
            'name',
            'price',
            'tag',
            'category',
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
