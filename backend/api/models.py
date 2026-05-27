from django.db import models


class Product(models.Model):
    TAG_CHOICES = [
        ('New', 'New'),
        ('SS25', 'SS25'),
        ('Limited', 'Limited'),
    ]

    CATEGORY_CHOICES = [
        ('Hoodies', 'Hoodies'),
        ('Tees', 'Tees'),
        ('Accessories', 'Accessories'),
    ]

    name = models.CharField(max_length=120)
    price = models.PositiveIntegerField()
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, blank=True, null=True)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='products/')
    description = models.TextField()
    sizes = models.JSONField(default=list)
    details = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name

    def to_dict(self, request=None):
        image_url = self.image.url if self.image else ''
        if request is not None and image_url:
            image_url = request.build_absolute_uri(image_url)

        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'tag': self.tag,
            'category': self.category,
            'image': image_url,
            'description': self.description,
            'sizes': self.sizes,
            'details': self.details,
        }
