from django.contrib import admin

from .models import ContactMessage, StoreSettings


@admin.register(StoreSettings)
class StoreSettingsAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'whatsapp_number_ng', 'whatsapp_number_gh', 'updated_at')
    readonly_fields = ('updated_at',)
    fieldsets = (
        ('WhatsApp checkout numbers', {
            'fields': ('whatsapp_number_ng', 'whatsapp_number_gh'),
            'description': 'Numbers the storefront uses to build the WhatsApp checkout link, '
                           'chosen by the visitor’s currency (NGN → Nigeria, GHS → Ghana).',
        }),
        (None, {'fields': ('updated_at',)}),
    )

    def has_add_permission(self, request):
        # Singleton — only allow the first (and only) row to be created.
        return not StoreSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'email_sent', 'created_at')
    list_filter = ('email_sent', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('name', 'email', 'message', 'email_sent', 'email_error', 'created_at')
