
from rest_framework.routers import DefaultRouter
from .views.views import ProductoViewSet, CategoriaViewSet, ComentarioViewSet,ProductoSearchView
from .views.carritoView import agregar_producto_carrito, eliminar_producto_carrito, obtener_carrito, RealizarCompraView, VaciarCarritoView
from django.urls import path
# Crear un router y registrar los ViewSets
router = DefaultRouter()
router.register(r'productos', ProductoViewSet)  # Rutas para productos
router.register(r'categorias', CategoriaViewSet)  # Rutas para categorías
router.register(r'comentarios', ComentarioViewSet)  # Rutas para comentarios

urlpatterns = [
    path('search/', ProductoSearchView.as_view(), name='producto-search'),
    path('carrito/agregar/', agregar_producto_carrito, name='agregar_producto_carrito'),
    path('carrito/eliminar/', eliminar_producto_carrito, name='eliminar_producto_carrito'),
    path('carrito/', obtener_carrito, name='obtener_carrito'),
    path('carrito/vaciar', VaciarCarritoView.as_view(), name='vaciar_carrito'),
    path('carrito/comprar', RealizarCompraView.as_view(), name='obtener_carrito'),
]
urlpatterns += router.urls