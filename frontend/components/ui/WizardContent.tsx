// WizardContent.tsx
"use client";
import React from "react";
import clsx from "clsx";
import { Service } from "@/lib/definitions";
import PaymentSelector from "./PaymentSelector";
import { useAppointment } from "@/context/appointmentContext";

interface WizardContentProps {
  currentStep: number;
  services: Service[];
}

const WizardContent: React.FC<WizardContentProps> = ({ currentStep, services }) => {
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  console.log(appointmentData);
  const handleSelectService = (service: Service) => {
    if (service.id === appointmentData.serviceId) {
      dispatch({ type: "DESELECT_SERVICE" });
    } else {
      dispatch({
        type: "SELECT_SERVICE",
        payload: {
          serviceId: service.id,
          serviceTitle: service.title,
          price: service.price,
          duration: parseInt(service.duration),
        },
      });
    }
  };

  const handleSelectPaymentMethod = (methodId: string) => {
    dispatch({ type: "SELECT_PAYMENT_METHOD", payload: methodId });
  };

  if (currentStep === 1) {
    return (
      <div>
        <h3 className="text-lg font-bold mb-4">Selecciona el servicio</h3>
        <div className="flex flex-col gap-4 w-full">
          {services.map((svc) => (
            <div
              key={svc.id}
              onClick={() => handleSelectService(svc)}
              className={clsx(
                "cursor-pointer p-4 border rounded-md shadow-sm transition-colors w-full",
                appointmentData.serviceId === svc.id
                  ? "border-blue-500 bg-blue-50 "
                  : "border-gray-300 bg-white"
              )}
            >
              <h2 className="text-lg font-bold mb-2">{svc.title}</h2>
              <p className="text-gray-700 text-sm mb-1">Precio: ${svc.price}</p>
              <p className="text-gray-700 text-sm mb-1">
                Duración: {svc.duration} min
              </p>
              <p className="text-gray-600 text-sm">{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (currentStep === 2) {
    return <p className="text-gray-800">Contenido: Agenda tu cita y hora.</p>;
  } else if (currentStep === 3) {
    return (
      <div>
        <h3 className="text-lg font-bold mb-4">Elige tu método de pago</h3>
        <PaymentSelector
          methods={[
            {
              id: "Credit Card",
              name: "Tarjeta de Crédito",
              imageUrl: "/images/mastercard-logo.svg",
            },
            {
              id: "PayPal",
              name: "PayPal",
              imageUrl: "/images/paypal_logo.png",
              description: "Pago seguro con PayPal",
            },
          ]}
          selectedMethodId={appointmentData.paymentMethod}
          onSelect={(method) => handleSelectPaymentMethod(method.id)}
        />
      </div>
    );
  } else if (currentStep === 4) {
    return (
      <div>
        <h3 className="font-bold mb-2">Resumen final de tu cita</h3>
        <p>
          <strong>Servicio:</strong> {appointmentData.serviceTitle}
        </p>
        <p>
          <strong>Precio:</strong> ${appointmentData.price}
        </p>
        <p>
          <strong>Duración:</strong> {appointmentData.duration} min
        </p>
        <p>
          <strong>Método de Pago:</strong>{" "}
          {appointmentData.paymentMethod || "No seleccionado"}
        </p>
      </div>
    );
  }
  return null;
};

export default WizardContent;
