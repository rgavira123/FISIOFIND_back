from rest_framework.permissions import BasePermission

class IsPatient(BasePermission):
    """
    Permite el acceso solo a usuarios que tengan un perfil de paciente.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'patient')

class IsPhysioOrPatient(BasePermission):
    """
    Permite el acceso a usuarios que sean pacientes o fisioterapeutas.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'patien') or hasattr(request.user, 'physio')
