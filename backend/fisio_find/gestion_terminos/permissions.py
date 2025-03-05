from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Permite el acceso a usuarios que sean administrador.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'admin')