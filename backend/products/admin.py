from django.contrib import admin

from .models import Category, Product, ProductImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_editable = ('is_active',)
    search_fields = ('name',)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'order', 'is_primary')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ('name', 'category', 'price', 'price_ghs', 'tag', 'is_active', 'updated_at')
    list_filter = ('category', 'tag', 'is_active')
    search_fields = ('name', 'description')
    list_editable = ('price', 'price_ghs', 'tag', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', ('price', 'price_ghs'), 'tag', 'category', 'image', 'is_active'),
        }),
        ('Product Content', {
            'fields': ('description', 'sizes', 'details'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
        }),
    )
