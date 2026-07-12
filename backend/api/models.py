from django.db import models


class StoreSettings(models.Model):
    """Store-wide settings — a singleton (always pk=1).

    Holds values that need to be editable from the admin without a redeploy,
    starting with the WhatsApp checkout numbers per market.
    """

    whatsapp_number_ng = models.CharField(
        'WhatsApp number (Nigeria)', max_length=20, blank=True, default='',
        help_text='International format, e.g. +2347045036178. Used when the store currency is NGN.',
    )
    whatsapp_number_gh = models.CharField(
        'WhatsApp number (Ghana)', max_length=20, blank=True, default='',
        help_text='International format, e.g. +233201234567. Used when the store currency is GHS.',
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Store settings'
        verbose_name_plural = 'Store settings'

    def __str__(self):
        return 'Store settings'

    def save(self, *args, **kwargs):
        # Pin to a single row so there is only ever one settings record.
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        """Return the singleton, creating it on first access."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    email_sent = models.BooleanField(default=False)
    email_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} <{self.email}>'
