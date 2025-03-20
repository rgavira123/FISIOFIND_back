// components/CheckoutForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getApiBaseUrl } from "@/utils/api";

interface CheckoutFormProps {
  request: {
    start_time: string;
    end_time: string;
    is_online: boolean;
    service: {
      type: string;
      price: number;
      duration: number;
    };
    physiotherapist: number;
    status: string;
    alternatives: string;
  };
}

const CheckoutForm = ({ request }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Estado para el modal


  // Puedes acceder al precio así:
  const price = request?.service?.price;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Token obtenido:", storedToken);
    if (storedToken) {
      setToken(storedToken);
      createAppointment(storedToken); // ⚡ Solo creamos la cita primero
    }
  }, []);

  async function createAppointment(tokenValue: string) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/appointment/patient/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
        body: JSON.stringify(request),
      });

      const data = await res.json();
      console.log("Respuesta del backend (cita creada):", data);

      if (data.id) {
        setAppointmentId(data.id); // Guardamos el appointment_id
        createPayment(tokenValue, data.id); // ⚡ Llamamos a createPayment después de obtener la cita
      } else {
        setMessage("Error al crear la cita.");
      }
    } catch (error) {
      console.error("Error al crear la cita:", error);
      setMessage("Error al crear la cita.");
    }
  }

  async function createPayment(tokenValue: string, appointmentId: number) {
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/payments/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenValue,
        },
        body: JSON.stringify({
          appointment_id: appointmentId, // ⚡ Ahora tenemos el ID correcto
          amount: price * 100, // Convertimos a centavos
        }),
      });

      const data = await res.json();
      console.log("Respuesta del backend (pago creado):", data);

      if (data.client_secret && data.payment) {
        setClientSecret(data.client_secret);
        setPaymentId(data.payment.id);
      } else {
        setMessage(
          "Error: La respuesta del servidor no tiene el client_secret."
        );
      }
    } catch (error) {
      console.error("Error al crear el pago:", error);
      setMessage("Error al crear el pago.");
    }
  }

  const handleSubmit = async (e, tokenValue: string) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Cliente de Ejemplo",
        },
      },
    });

    if (result.error) {
      setMessage(result.error.message || "Error al confirmar el pago.");
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        try {
          const confirmRes = await fetch(
            `${getApiBaseUrl()}/api/payments/${paymentId}/confirm/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
          const confirmData = await confirmRes.json();
          console.log("Confirmación del backend:", confirmData);
          // setMessage("¡Pago realizado con éxito!");
          setShowModal(true); // Mostrar el modal al completar el pago
        } catch (error) {
          console.error("Error al confirmar el pago en el backend:", error);
          setMessage("Pago realizado, pero error al confirmar en el servidor.");
        }
      } else if (result.paymentIntent.status === "canceled") {
        await fetch(
          `${getApiBaseUrl()}/api/appointment/delete/${appointmentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + tokenValue,
            },
          }
        );
      }
    }
    setLoading(false);
  };

  // Opciones de estilo para CardElement
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 14px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
      hidePostalCode: true,
    },
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={formStyles}>
        <h2 style={headingStyles}>Completa tu pago</h2>
        <div style={cardElementContainer}>
          <CardElement options={cardStyle} />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          style={buttonStyles}
        >
          {loading ? "Procesando..." : `Pagar ${price} €`}
        </button>
        {message && <div style={messageStyles}>{message}</div>}
      </form>
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>¡Pago Exitoso! 🎉</h2>
            <p>Tu cita ha sido confirmada.</p>
            <button
              style={modalButton}
              onClick={async () => {
                try {
                  const response = await fetch(
                    `${getApiBaseUrl()}/api/payments/invoices/pdf/?payment_id=${paymentId}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
            
                  if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.error || "No se pudo descargar la factura"}`);
                    return;
                  }
            
                  // Convertir la respuesta en un blob (archivo descargable)
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `invoice_${paymentId}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } catch (error) {
                  console.error("Error al descargar la factura:", error);
                  alert("Error al descargar la factura.");
                }
              }}
            >
              Descargar Factura
                        </button>
            <button
              style={modalButton}
              onClick={() => (window.location.href = "/mis-citas")}
            >
              Ir al Calendario
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Ejemplo de estilos en línea para el formulario
const formStyles: React.CSSProperties = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "2rem",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
};

const headingStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "1.5rem",
  color: "#32325d",
};

const cardElementContainer: React.CSSProperties = {
  padding: "1rem",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  marginBottom: "1rem",
};

const buttonStyles: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#5469d4",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

const messageStyles: React.CSSProperties = {
  marginTop: "1rem",
  textAlign: "center",
  color: "#fa755a",
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContent: React.CSSProperties = {
  background: "white",
  padding: "2rem",
  borderRadius: "8px",
  textAlign: "center",
};

const modalButton: React.CSSProperties = {
  marginTop: "2rem",
  padding: "10px 20px",
  backgroundColor: "#5469d4",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
  marginRight: "10px",
};


export default CheckoutForm;
