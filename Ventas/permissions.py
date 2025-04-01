from rest_framework import permissions

class IsProductOwner(permissions.BasePermission):
    """
    Permiso personalizado para asegurar que solo el propietario del producto pueda modificarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Si es una solicitud de lectura (GET, HEAD, OPTIONS), permite el acceso
        if request.method in permissions.SAFE_METHODS:
            return True
        # Solo el propietario del producto (vendedor) puede modificarlo (POST, PUT, DELETE)
        return obj.vendedor == request.user