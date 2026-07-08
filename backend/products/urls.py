from django.urls import path

from .views import (
    CategoryDetailAPIView, CategoryListAPIView,
    ProductDetailAPIView, ProductListAPIView,
    ProductImageListAPIView, ProductImageDetailAPIView,
)


urlpatterns = [
    path('', ProductListAPIView.as_view(), name='product_list'),
    path('<int:product_id>/', ProductDetailAPIView.as_view(), name='product_detail'),
    path('<int:product_id>/images/', ProductImageListAPIView.as_view(), name='product_image_list'),
    path('<int:product_id>/images/<int:image_id>/', ProductImageDetailAPIView.as_view(), name='product_image_detail'),
    path('categories/', CategoryListAPIView.as_view(), name='category_list'),
    path('categories/<int:category_id>/', CategoryDetailAPIView.as_view(), name='category_detail'),
]
