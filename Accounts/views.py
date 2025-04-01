# accounts/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated, AllowAny
from .serializers.accountSerializers import UserRegisterSerializer
from .serializers.loginSerializers import LoginSerializer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = User.objects.all()  # Aquí defines el queryset
    serializer_class = UserRegisterSerializer
    

@api_view(['POST'])
@permission_classes([AllowAny])  # Permitir acceso sin autenticación
def get_token_and_login(request):
    if request.method == 'POST':
        # Obtener la URL de redirección 'next', si no está presente, usar '/' por defecto
        next_url = request.data.get('next', '/')
        
        # Usar el serializador para validar las credenciales
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            # Obtener el usuario mediante la autenticación
            user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
            
            if user:
                # Crear los tokens (access_token y refresh_token)
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                # Responder con los tokens
                response_data = {
                    'message': "Sesión iniciada",
                    'access_token': str(access_token),  # Access Token
                    'refresh_token': str(refresh),  # Refresh Token
                    'next': next_url,  # Redirigir al 'next' si se especificó
                    'user_id': user.id
                }
                
                return Response(response_data, status=200)  # Enviar la respuesta al frontend
            else:
                return Response({'error': 'Credenciales incorrectas'}, status=400)  # Si las credenciales son incorrectas

        # Si los datos enviados no son válidos
        return Response({'error': 'Datos incorrectos'}, status=400)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Obtener el refresh token desde el encabezado
            refresh_token = request.headers.get('x-refresh-token')

            if refresh_token:
                try:
                    # Validar y revocar el refresh token
                    token = RefreshToken(refresh_token)
                    token.blacklist()  # Esto revoca el refresh token
                except Exception as e:
                    return Response({"detail": "Token inválido"}, status=HTTP_400_BAD_REQUEST)
            
            # Eliminar el token en el lado del cliente (en este caso es solo en el frontend)
            return Response({"detail": "Logout exitoso"}, status=HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=HTTP_400_BAD_REQUEST)