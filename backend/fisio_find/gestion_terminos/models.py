from django.db import models
from gestion_usuarios.models import AppUser

# Create your models here.
class AppTerminos(models.Model):
    modifier = models.ForeignKey(AppUser, on_delete=models.PROTECT)
    content = models.TextField()
    version = models.CharField(max_length=100)
    created_at = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content