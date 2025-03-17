import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from .serializers import PaymentSerializer
from gestion_citas.models import Appointment
from django.utils import timezone
from gestion_usuarios.permissions import IsPatient 

stripe.api_key = settings.STRIPE_SECRET_KEY

def _check_deadline(appointment):
    """Check if the payment deadline has passed and cancel the appointment if needed."""
    now = timezone.now()
    if now > appointment.start_time - timezone.timedelta(hours=48) and appointment.payment.status == 'Not Paid':
        appointment.status = 'Canceled'
        appointment.save()
        return True
    return False

@api_view(['POST'])
@permission_classes([IsPatient])
def create_payment(request):
    """Create a payment for an appointment."""
    appointment_id = request.data.get('appointment_id')
    amount = request.data.get('amount', 1000)  # Amount in cents (e.g., 10.00 USD)

    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        # Check if the user is the patient associated with the appointment
        if request.user.patient != appointment.patient:
            return Response({'error': 'You can only pay for your own appointments'}, 
                            status=status.HTTP_403_FORBIDDEN)

        # Check if deadline has passed
        if _check_deadline(appointment):
            return Response({'error': 'Payment deadline has expired and the appointment was canceled'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Create payment intent with Stripe
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='eur',
            payment_method_types=['card'],
        )

        # Create or update payment record
        payment, created = Payment.objects.get_or_create(
            appointment=appointment,
            defaults={'amount': amount / 100, 'stripe_payment_intent_id': payment_intent['id']}
        )
        serializer = PaymentSerializer(payment)
        return Response({
            'payment': serializer.data,
            'client_secret': payment_intent['client_secret']  # For frontend to complete payment
        }, status=status.HTTP_201_CREATED)

    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Error processing payment: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsPatient])
def confirm_payment(request, payment_id):
    """Confirm a payment for an appointment."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Check if the user is the patient associated with the appointment
        if request.user != payment.appointment.patient:
            return Response({'error': 'You can only confirm payments for your own appointments'}, 
                            status=status.HTTP_403_FORBIDDEN)

        # Check if deadline has passed
        if _check_deadline(payment.appointment):
            return Response({'error': 'Payment deadline has expired and the appointment was canceled'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        if payment.status == 'Paid':
            return Response({'error': 'Payment is already confirmed'}, status=status.HTTP_400_BAD_REQUEST)

        payment.status = 'Paid'
        payment.payment_date = timezone.now()
        payment.save()
        payment.appointment.status = 'Paid'
        payment.appointment.save()

        serializer = PaymentSerializer(payment)
        return Response({'message': 'Payment confirmed', 'payment': serializer.data}, 
                        status=status.HTTP_200_OK)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Error confirming payment: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsPatient])
def cancel_payment(request, payment_id):
    """Cancel an appointment and handle refund if applicable."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Check if the user is the patient associated with the appointment
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'You can only cancel your own appointments'}, 
                            status=status.HTTP_403_FORBIDDEN)

        appointment = payment.appointment
        now = timezone.now()

        if now > appointment.start_time:
            return Response({'error': 'The appointment has already passed'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        if payment.status == 'Not Paid' and now <= payment.payment_deadline:
            appointment.status = 'Canceled'
            appointment.save()
            return Response({'message': 'Appointment canceled without charge'}, 
                            status=status.HTTP_200_OK)

        if payment.status == 'Paid' and now >= appointment.start_time - timezone.timedelta(hours=48):
            # Issue refund
            stripe.Refund.create(payment_intent=payment.stripe_payment_intent_id)
            payment.status = 'Refunded'
            payment.save()
            appointment.status = 'Canceled'
            appointment.save()
            return Response({'message': 'Appointment canceled with refund'}, 
                            status=status.HTTP_200_OK)

        appointment.status = 'Canceled'
        appointment.save()
        return Response({'message': 'Appointment canceled without refund'}, 
                        status=status.HTTP_200_OK)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Error canceling payment: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsPatient])
def get_payment_details(request, payment_id):
    """Retrieve payment details."""
    try:
        payment = Payment.objects.get(id=payment_id)

        # Check if the user is the patient associated with the appointment
        if request.user.patient != payment.appointment.patient:
            return Response({'error': 'You can only view your own payment details'}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)