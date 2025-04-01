from django.db import models
from django.contrib.auth.models import User

class Token(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    key = models.CharField(max_length=500)  # Aumentamos el tamaño a 500 o más para evitar truncamientos.

    def __str__(self):
        return f"Token for {self.user.username}"