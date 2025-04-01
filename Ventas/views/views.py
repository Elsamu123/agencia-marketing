from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework import viewsets
from ..models import Producto, Categoria, Comentario
from ..serializers import ProductoSerializer, ComentarioSerializer, CategoriaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from ..permissions import IsProductOwner
from django.utils.text import slugify


class ProductoViewSet(viewsets.ModelViewSet):
    #queryset = Producto.objects.all()  # Queryset que devuelve todos los productos
    queryset = Producto.objects.select_related('categoria').all() 
    serializer_class = ProductoSerializer  # Clase que define cómo serializar los productos
    lookup_field = 'slug' 
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:  # Solo para acciones de modificación
            self.permission_classes = [AllowAny]  # Permiso personalizado que verifica si el usuario es el propietario
        return super().get_permissions()
    
    def perform_create(self, serializer):
        # Asignamos el vendedor al usuario autenticado
        producto = serializer.save(vendedor=self.request.user)

        if not producto.slug:
          producto.slug = slugify(f"{producto.nombre}-{producto.marca}-{producto.modelo}")

        producto.save()

    def perform_update(self, serializer):
      
      producto = serializer.instance
    
      # Verifica si se están modificando los campos relevantes para el slug
      if 'nombre' in serializer.validated_data or 'marca' in serializer.validated_data or 'modelo' in serializer.validated_data:
         
        nombre = serializer.validated_data.get('nombre', producto.nombre)
        marca = serializer.validated_data.get('marca', producto.marca)
        modelo = serializer.validated_data.get('modelo', producto.modelo)
        
        # Generamos el nuevo slug
        nuevo_slug = slugify(f"{nombre}-{marca}-{modelo}")
        
        # Asignamos el nuevo slug al producto
        producto.slug = nuevo_slug
        
        # Debugging para verificar el slug
        print(f"Slug actualizado a: {producto.slug}")
    
      # Guardamos el producto con el slug actualizado
      serializer.save()

# ViewSet para el modelo Categoria
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()  # Queryset que devuelve todas las categorías
    serializer_class = CategoriaSerializer  # Clase que define cómo serializar las categorías
    permission_classes = [AllowAny]
   
# ViewSet para el modelo Comentario
class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()  # Queryset que devuelve todos los comentarios
    serializer_class = ComentarioSerializer  # Clase que define cómo serializar los comentarios
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProductoSearchView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.GET.get('q', '')
        productos = Producto.objects.all()

        try:
            if query:
                # Filtrar productos por nombre, categoria o marca
                productos = productos.filter(
                    Q(nombre__icontains=query) |
                    Q(marca__icontains=query) |
                    Q(categoria__nombre__icontains=query) 
                    
                )

            # Serializar los productos
            serializer = ProductoSerializer(productos ,many=True)
            return Response(serializer.data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


    