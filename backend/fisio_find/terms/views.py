from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from users.permissions import IsAdmin
from .models import Terms
from .serializers import TermsSerializer


class TermsList(generics.ListAPIView):
    queryset = Terms.objects.all().order_by('-updated_at')
    serializer_class = TermsSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['tag']

    def get_queryset(self):
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag', None)
        if tag:
            queryset = queryset.filter(tag=tag)
        return queryset


class TermsDetail(generics.RetrieveAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [AllowAny]


class TermsCreate(generics.CreateAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        serializer.save(modifier=self.request.user.admin)


class TermsUpdate(generics.UpdateAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        serializer.save(modifier=self.request.user.admin)


class TermsDelete(generics.DestroyAPIView):
    queryset = Terms.objects.all()
    serializer_class = TermsSerializer
    permission_classes = [IsAdmin]
