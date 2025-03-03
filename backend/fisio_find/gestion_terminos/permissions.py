from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin perform an action.
    """
    def has_priviledges(self, request, view, obj):

        return request.user.is_admin