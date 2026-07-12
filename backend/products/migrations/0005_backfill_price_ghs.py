from django.db import migrations


# Old FX fallback rate (1 NGN ≈ 0.068 GHS). Used only to seed a sensible starting
# GHS price for products that already existed before manual GHS pricing was added.
# These are approximate — review/adjust each product's price_ghs in the admin.
FALLBACK_RATE = 0.068


def backfill_price_ghs(apps, schema_editor):
    Product = apps.get_model('products', 'Product')
    for product in Product.objects.filter(price_ghs=0):
        product.price_ghs = round(product.price * FALLBACK_RATE)
        product.save(update_fields=['price_ghs'])


def reverse_backfill(apps, schema_editor):
    # Non-destructive reverse: reset the seeded values back to 0.
    Product = apps.get_model('products', 'Product')
    Product.objects.update(price_ghs=0)


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_product_price_ghs'),
    ]

    operations = [
        migrations.RunPython(backfill_price_ghs, reverse_backfill),
    ]
