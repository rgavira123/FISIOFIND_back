from django.urls import path
from .views import create_payment, confirm_payment, cancel_payment, get_payment_details

urlpatterns = [
    path('create/', create_payment, name='create_payment'),
    path('<int:payment_id>/confirm/', confirm_payment, name='confirm_payment'),
    path('<int:payment_id>/cancel/', cancel_payment, name='cancel_payment'),
    path('<int:payment_id>/', get_payment_details, name='get_payment_details'),
]