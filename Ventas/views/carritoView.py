# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Producto, Carrito, CarritoProducto
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication
from ..serializers import ProductoSerializer, CarritoProductoSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def agregar_producto_carrito(request):
    user = request.user  # Obtener el usuario autenticado a partir del token
    producto_id = request.data.get('producto_id')
    cantidad = request.data.get('cantidad')
    
    # Validación de la cantidad
    if not cantidad:
        return Response({'error': 'La cantidad debe ser un número mayor que cero.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Intentar obtener el producto con el id dado
        producto = Producto.objects.get(id=producto_id)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    
    # Verificar si hay suficiente stock
    if cantidad > producto.stock:
      return Response({'error': 'No hay suficiente stock para agregar ese producto'}, status=status.HTTP_400_BAD_REQUEST)

    # Intentamos obtener o crear el carrito del usuario
    carrito, created = Carrito.objects.get_or_create(user=user)

    # Intentamos obtener o crear el carrito_producto, asociado con el carrito y el producto
    carrito_producto, created = CarritoProducto.objects.get_or_create(carrito=carrito, producto=producto)

    # Si el producto ya estaba en el carrito, aumentamos la cantidad
    if not created:
        if cantidad + carrito_producto.cantidad > producto.stock:
            return Response({'error': 'Inventario insuficiente'}, status=status.HTTP_400_BAD_REQUEST)
        
        carrito_producto.cantidad += cantidad
        carrito_producto.save()
    else:
        # Si el producto no estaba en el carrito, lo agregamos con la cantidad
        carrito_producto.cantidad = cantidad
        carrito_producto.save()

    # Serializar el producto agregado
    carrito_producto_serializado = CarritoProductoSerializer(carrito_producto)

    # Retornar la respuesta
    return Response({'producto': carrito_producto_serializado.data, 'message': 'Producto agregado al carrito'}, status=status.HTTP_201_CREATED)



@permission_classes([IsAuthenticated])
@api_view(['POST'])
def eliminar_producto_carrito(request):
    user = request.user
    producto_id = request.data.get('producto_id')
    try:
        producto = Producto.objects.get(id=producto_id)
    except Producto.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    carrito = Carrito.objects.get(user=user)
    try:
        carrito_producto = CarritoProducto.objects.get(carrito=carrito, producto=producto)
        carrito_producto.delete()
        return Response({'message': 'Producto eliminado del carrito'}, status=status.HTTP_200_OK)
    except CarritoProducto.DoesNotExist:
        return Response({'error': 'Producto no está en el carrito'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_carrito(request):
    user = request.user
    carrito, created = Carrito.objects.get_or_create(user=user)
    print(request.user)
    if created:
        return Response({'message': 'Carrito creado', 'productos': []}, status=status.HTTP_200_OK)
   

    carrito_productos = CarritoProducto.objects.filter(carrito=carrito)
    serializer = CarritoProductoSerializer(carrito_productos, many=True)
    productos_carrito_en_carrito = []

    for item in carrito_productos:  
        producto = item.producto  # Asumiendo que 'producto' es una instancia de Producto
        producto_serializado = ProductoSerializer(producto)  # Serializas el producto
        productos_carrito_en_carrito.append({
            'producto': producto_serializado.data,  # Accedemos a los datos serializados con `.data`
            'cantidad': item.cantidad
        })

    return Response({'productos': productos_carrito_en_carrito}, status=status.HTTP_200_OK)

class VaciarCarritoView(APIView):
    permission_classes = [IsAuthenticated]  # Aseguramos que solo los usuarios autenticados puedan vaciar su carrito

    def post(self, request):
        try:
            # Obtener el carrito del usuario actual
            carrito = CarritoProducto.objects.filter(usuario=request.user)

            # Verificamos si el carrito existe y tiene productos
            if carrito.exists():
                # Eliminar todos los productos del carrito
                carrito.delete()
                return Response({"message": "Carrito vaciado exitosamente."}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": f"Error al vaciar el carrito: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RealizarCompraView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        carrito = Carrito.objects.filter(usuario=request.user)

        if not carrito.exists():
            return Response({"error": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

        # Aquí procesas la compra (por ejemplo, creas un pedido)
        carrito.delete()  # Vaciar el carrito tras la compra

        return Response({"message": "Compra realizada y carrito vaciado."}, status=status.HTTP_200_OK)