import django.db.models.deletion
from django.db import migrations, models


def migrate_images_forward(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    ProductImage = apps.get_model('products', 'ProductImage')
    for product in Product.objects.exclude(image='').exclude(image=None):
        ProductImage.objects.create(
            product=product,
            image=product.image.name,
            order=0,
            is_primary=True,
        )


def migrate_images_reverse(apps, schema_editor):
    ProductImage = apps.get_model('products', 'ProductImage')
    ProductImage.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_category_alter_product_category'),
    ]

    operations = [
        # 1. Create the new table first
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='products/')),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_primary', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='products.product')),
            ],
            options={
                'ordering': ['order', 'id'],
            },
        ),
        # 2. Copy existing images into ProductImage rows
        migrations.RunPython(migrate_images_forward, migrate_images_reverse),
        # 3. Now safe to drop the old column
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
    ]
