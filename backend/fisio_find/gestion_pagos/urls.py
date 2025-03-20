from django.urls import path
from .views import create_payment, confirm_payment, cancel_payment, get_payment_details, invoice_pdf_view, total_money

urlpatterns = [
    path('create/', create_payment, name='create_payment'),
    path('<int:payment_id>/confirm/', confirm_payment, name='confirm_payment'),
    path('<int:payment_id>/cancel/', cancel_payment, name='cancel_payment'),
    path('<int:payment_id>/', get_payment_details, name='get_payment_details'),
    path('invoices/pdf/', invoice_pdf_view, name='invoice_pdf'),
    path('total/', total_money, name='total_money'),

]