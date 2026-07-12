from django.db import migrations


# The NG number that was previously hardcoded in the storefront checkout.
# Seed it so behaviour is preserved until an admin edits it.
DEFAULT_NG_NUMBER = '+2347045036178'


def seed_settings(apps, schema_editor):
    StoreSettings = apps.get_model('api', 'StoreSettings')
    StoreSettings.objects.update_or_create(
        pk=1,
        defaults={'whatsapp_number_ng': DEFAULT_NG_NUMBER},
    )


def unseed_settings(apps, schema_editor):
    StoreSettings = apps.get_model('api', 'StoreSettings')
    StoreSettings.objects.filter(pk=1).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_storesettings'),
    ]

    operations = [
        migrations.RunPython(seed_settings, unseed_settings),
    ]
