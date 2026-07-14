import random

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction

from products.models import Category, Product, ProductImage

# Placeholder catalog for testing admin pagination — realistic names/prices in the
# existing Cokerflux voice, distributed across the real Category rows. Names are
# prefixed nowhere (they should look real), but every product carries the
# PLACEHOLDER_MARKER in its description so `--clear` can remove exactly these
# and nothing else.
PLACEHOLDER_MARKER = '[placeholder]'

# GHS ≈ NGN * 0.068, matching the ratio on existing products (48000 -> 3264)
GHS_RATE = 0.068

CATALOG = {
    'Hoodies': [
        ('Static Pullover Hoodie', 45000),
        ('Lowline Boxy Hoodie', 52000),
        ('Interference Hoodie', 48000),
        ('Night Signal Hoodie', 50000),
        ('Off-Grid Zip Hoodie', 54000),
        ('Monotone Heavy Hoodie', 46000),
    ],
    'Tees': [
        ('Feedback Loop Tee', 21000),
        ('Broadcast Tee', 22000),
        ('Quiet Frequency Tee', 20000),
        ('Static Wash Tee', 24000),
        ('Transmission Tee', 23000),
        ('Mono Channel Tee', 21500),
        ('Waveform Graphic Tee', 25000),
    ],
    'Caps': [
        ('Interference 5-Panel Cap', 15000),
        ('Low Signal Dad Cap', 14000),
        ('Frequency Snapback', 16000),
        ('Blackout 6-Panel Cap', 15500),
    ],
}

SIZE_POOL = {
    'Hoodies': ['S', 'M', 'L', 'XL', 'XXL'],
    'Tees': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Caps': ['One Size'],
}

DETAILS = {
    'Hoodies': [
        '380gsm heavyweight fleece',
        'Dropped shoulder fit',
        'Ribbed cuffs and hem',
        'Embroidered Cokerflux chest logo',
    ],
    'Tees': [
        '220gsm 100% cotton',
        'Regular fit',
        'Screen-printed chest logo',
    ],
    'Caps': [
        'Structured crown',
        'Adjustable strap',
        'Embroidered front logo',
    ],
}

DESCRIPTIONS = {
    'Hoodies': 'Cut heavy and boxy for a silhouette that holds its own. Small run, no restocks.',
    'Tees': 'Clean and heavy, built to last past the season. Small run, no restocks.',
    'Caps': 'Sharp lines, low profile. Finishes the fit without shouting.',
}

TAGS = ['New', 'SS25', 'Limited', None]

# 1x1 dark-grey PNG so every placeholder has a real ImageField file without
# depending on any existing media on disk.
PIXEL_PNG = bytes.fromhex(
    '89504e470d0a1a0a0000000d49484452000000010000000108020000009077'
    '53de0000000c4944415408d763a8adad07000246019dc31d23c30000000049'
    '454e44ae426082'
)


class Command(BaseCommand):
    help = 'Seed placeholder products (marked in description) for testing admin pagination. --clear removes them.'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Delete previously seeded placeholder products')

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            qs = Product.objects.filter(description__contains=PLACEHOLDER_MARKER)
            count = qs.count()
            for product in qs:
                for img in product.images.all():
                    img.image.delete(save=False)
            qs.delete()
            self.stdout.write(self.style.SUCCESS(f'Removed {count} placeholder products'))
            self.stdout.write(f'Products remaining: {Product.objects.count()}')
            return

        rng = random.Random(25)  # deterministic so reruns are predictable
        categories = {c.name: c for c in Category.objects.filter(is_active=True)}
        created = 0
        skipped = 0

        for cat_name, items in CATALOG.items():
            if cat_name not in categories:
                self.stdout.write(self.style.WARNING(f'Skipping {cat_name}: no such active category'))
                continue
            for name, price in items:
                if Product.objects.filter(name=name).exists():
                    skipped += 1
                    continue
                sizes = SIZE_POOL[cat_name]
                product = Product.objects.create(
                    name=name,
                    price=price,
                    price_ghs=round(price * GHS_RATE),
                    tag=rng.choice(TAGS),
                    category=cat_name,
                    description=f'{DESCRIPTIONS[cat_name]} {PLACEHOLDER_MARKER}',
                    sizes=rng.sample(sizes, k=min(len(sizes), rng.randint(2, len(sizes)))) if len(sizes) > 1 else sizes,
                    details=DETAILS[cat_name],
                )
                ProductImage.objects.create(
                    product=product,
                    image=ContentFile(PIXEL_PNG, name=f'placeholder-{product.id}.png'),
                    order=0,
                    is_primary=True,
                )
                created += 1

        total = Product.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Created {created} placeholder products ({skipped} already existed)'))
        self.stdout.write(f'Total products now: {total}')
