from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=60, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    TAG_CHOICES = [
        ('New', 'New'),
        ('SS25', 'SS25'),
        ('Limited', 'Limited'),
    ]

    name = models.CharField(max_length=120)
    price = models.PositiveIntegerField()
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, blank=True, null=True)
    category = models.CharField(max_length=60)
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


class ProductImage(models.Model):
    product    = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='products/')
    order      = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.product.name} — image {self.order}'
