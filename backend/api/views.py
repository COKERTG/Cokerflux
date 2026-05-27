from django.http import JsonResponse

from .models import Product


def health(request):
    return JsonResponse({'ok': True, 'service': 'cokerflux-backend'})


def products(request):
    items = Product.objects.filter(is_active=True)
    return JsonResponse({'products': [product.to_dict(request) for product in items]})


def product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

    return JsonResponse({'product': product.to_dict(request)})
