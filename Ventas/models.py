from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)  # Nombre de la categoría
    descripcion = models.TextField(null=True, blank=True)  # Descripción de la categoría
    
    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=200) 
    descripcion = models.TextField() 
    precio = models.DecimalField(max_digits=10, decimal_places=2)  # Precio con 2 decimales
    modelo = models.TextField(max_length=15, blank=False)
    vendedor = models.ForeignKey(User, on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='productos/', null=True,  blank=True)  # Imagen del producto
    stock = models.PositiveIntegerField(default=1, blank=True)  # Cantidad en inventario
    categoria = models.ForeignKey(Categoria, related_name='productos', on_delete=models.SET_NULL, null=True, blank=False)  # Categoría del producto
    marca = models.CharField(max_length=100, blank=False)  # Marca del producto
    fecha_agregado = models.DateTimeField(auto_now_add=True)  # Fecha de agrego del producto
    fecha_actualizado = models.DateTimeField(auto_now=True)  # Fecha de la última actualización
    slug = models.SlugField(unique=True, blank=True)  # URL amigable (para SEO)
    
    
    def __str__(self):
        return self.nombre


class Comentario(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='comentarios')  # Producto relacionado
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)  # Usuario que realiza el comentario
    texto = models.TextField()  # Texto del comentario
    calificacion = models.PositiveIntegerField(choices=[(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])  # Calificación del 1 al 5
    fecha_comentado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.usuario.username} sobre {self.producto.nombre}"

class Carrito(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto, through='CarritoProducto')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Carrito de {self.user.username}"

class CarritoProducto(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

