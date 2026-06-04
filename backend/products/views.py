from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.permissions import IsOwnerOrAdmin

from .models import Product
from .serializers import ProductSerializer, ProductWriteSerializer
from django.db.models import Q

class ProductListAPIView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        is_admin = (
            request.user.is_authenticated
            and hasattr(request.user, 'profile')
            and request.user.profile.can_manage_products
        )
        qs = Product.objects.all() if is_admin else Product.objects.filter(is_active=True)
        query = request.GET.get('search')
        tag = request.GET.get('tag')
        category = request.GET.get('category')

        # Apply search filtering
        if query:
            qs = qs.filter(Q(name__icontains=query) | Q(description__icontains=query))
        if tag:
            qs = qs.filter(tag=tag)
        if category:
            qs = qs.filter(category=category)

        # Pagination
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))

        total = qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        qs_page = qs[start:end]
        serializer = ProductSerializer(qs_page, many=True, context={'request': request})
        return Response({
            'products': serializer.data,
            'page': page,
            'page_size': page_size,
            'total': total,
        })

    def post(self, request):
        serializer = ProductWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        product = serializer.save()
        return Response(
            {'product': ProductSerializer(product, context={'request': request}).data},
            status=status.HTTP_201_CREATED,
        )


class ProductDetailAPIView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        if self.request.method == 'DELETE':
            return [IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def _get_or_404(self, product_id):
        try:
            return Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return None

    def get(self, request, product_id):
        product = self._get_or_404(product_id)
        is_staff = request.user.is_authenticated and hasattr(request.user, 'profile')
        if not product or (not product.is_active and not is_staff):
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, context={'request': request})
        return Response({'product': serializer.data})

    def put(self, request, product_id):
        product = self._get_or_404(product_id)
        if not product:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductWriteSerializer(product, data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        product = serializer.save()
        return Response({'product': ProductSerializer(product, context={'request': request}).data})

    def patch(self, request, product_id):
        product = self._get_or_404(product_id)
        if not product:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductWriteSerializer(product, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        product = serializer.save()
        return Response({'product': ProductSerializer(product, context={'request': request}).data})

    def delete(self, request, product_id):
        product = self._get_or_404(product_id)
        if not product:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
