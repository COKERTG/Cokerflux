from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('price', models.PositiveIntegerField()),
                ('tag', models.CharField(blank=True, choices=[('New', 'New'), ('SS25', 'SS25'), ('Limited', 'Limited')], max_length=20, null=True)),
                ('category', models.CharField(choices=[('Hoodies', 'Hoodies'), ('Tees', 'Tees'), ('Accessories', 'Accessories')], max_length=40)),
                ('image', models.ImageField(upload_to='products/')),
                ('description', models.TextField()),
                ('sizes', models.JSONField(default=list)),
                ('details', models.JSONField(default=list)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
