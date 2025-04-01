from rest_framework import serializers
from .models import Producto, Comentario, Categoria, CarritoProducto


class ProductoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField()
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ['vendedor', 'fecha_agregado', 'fecha_actualizado', 'slug']
    
    def validate_imagen(self, value):
        # Validación de la imagen, si es necesario (puedes agregar reglas adicionales aquí)
        if value and value.size > 5 * 1024 * 1024:  # Limitar el tamaño de la imagen a 5MB
            raise serializers.ValidationError("La imagen no debe ser mayor a 5MB")
        return value
    
class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class CarritoProductoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer()

    class Meta:
        model = CarritoProducto
        fields = ['producto', 'cantidad']        