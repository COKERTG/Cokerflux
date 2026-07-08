from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from users.permissions import IsOwnerOrAdmin

from .models import Category, Product, ProductImage
from .serializers import CategorySerializer, ProductImageSerializer, ProductSerializer, ProductWriteSerializer
from django.db.models import Q

MAX_IMAGES = 5

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
        files = request.FILES.getlist('images')[:MAX_IMAGES]
        with transaction.atomic():
            product = serializer.save()
            for i, file in enumerate(files):
                ProductImage.objects.create(
                    product=product,
                    image=file,
                    order=i,
                    is_primary=(i == 0),
                )
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


class ProductImageListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        current_count = product.images.count()
        files = request.FILES.getlist('images')
        slots = MAX_IMAGES - current_count
        if slots <= 0:
            return Response({'error': f'Max {MAX_IMAGES} images per product'}, status=status.HTTP_400_BAD_REQUEST)
        files = files[:slots]

        created = []
        for i, file in enumerate(files):
            img = ProductImage.objects.create(
                product=product,
                image=file,
                order=current_count + i,
                is_primary=(current_count == 0 and i == 0),
            )
            created.append(img)
        return Response(
            {'images': ProductImageSerializer(created, many=True, context={'request': request}).data},
            status=status.HTTP_201_CREATED,
        )


class ProductImageDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def _get(self, product_id, image_id):
        try:
            return ProductImage.objects.get(id=image_id, product_id=product_id)
        except ProductImage.DoesNotExist:
            return None

    def delete(self, request, product_id, image_id):
        img = self._get(product_id, image_id)
        if not img:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        was_primary = img.is_primary
        img.image.delete(save=False)
        img.delete()
        if was_primary:
            first = ProductImage.objects.filter(product_id=product_id).first()
            if first:
                first.is_primary = True
                first.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, product_id, image_id):
        img = self._get(product_id, image_id)
        if not img:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        ProductImage.objects.filter(product_id=product_id).update(is_primary=False)
        img.is_primary = True
        img.save()
        return Response({'image': ProductImageSerializer(img, context={'request': request}).data})


class CategoryListAPIView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsOwnerOrAdmin()]

    def get(self, request):
        is_manager = (
            request.user.is_authenticated
            and hasattr(request.user, 'profile')
            and request.user.profile.can_manage_products
        )
        qs = Category.objects.all() if is_manager else Category.objects.filter(is_active=True)
        return Response({'categories': CategorySerializer(qs, many=True).data})

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        category = serializer.save()
        return Response({'category': CategorySerializer(category).data}, status=status.HTTP_201_CREATED)


class CategoryDetailAPIView(APIView):
    permission_classes = [IsOwnerOrAdmin]

    def _get_or_404(self, pk):
        try:
            return Category.objects.get(id=pk)
        except Category.DoesNotExist:
            return None

    def patch(self, request, category_id):
        category = self._get_or_404(category_id)
        if not category:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        category = serializer.save()
        return Response({'category': CategorySerializer(category).data})

    def delete(self, request, category_id):
        category = self._get_or_404(category_id)
        if not category:
            return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
