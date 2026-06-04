from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'tag', 'is_active', 'updated_at')
    list_filter = ('category', 'tag', 'is_active')
    search_fields = ('name', 'description')
    list_editable = ('price', 'tag', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'price', 'tag', 'category', 'image', 'is_active'),
        }),
        ('Product Content', {
            'fields': ('description', 'sizes', 'details'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
