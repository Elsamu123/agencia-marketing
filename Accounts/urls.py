
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, get_token_and_login, LogoutView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.urls import path

# Crear un router y registrar los ViewSets
router = DefaultRouter()
router.register(r'accounts', AccountViewSet)  # Rutas para productos

urlpatterns = [
    path('login/', get_token_and_login, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]

urlpatterns += router.urls