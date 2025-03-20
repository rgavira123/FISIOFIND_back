"use client";
import React from "react";
import clsx from "clsx";
import { Service } from "@/lib/definitions";
import { useAppointment } from "@/context/appointmentContext";
import AppointmentCalendar from "./AppointmentCalendar";
import { formatAppointment } from "@/lib/utils"; // Se importa la función de formateo
import { useParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

interface WizardContentProps {
  currentStep: number;
  services: Service[];
}

// Función para calcular el máximo común divisor de dos números
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// Calcula el GCD de un arreglo de números
const computeGCD = (arr: number[]): number => {
  return arr.reduce((prev, curr) => gcd(prev, curr));
};

const WizardContent: React.FC<WizardContentProps> = ({
  currentStep,
  services,
}) => {
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  console.log(appointmentData);
  const { id } = useParams();
  const physioId = parseInt(id as string);

  const handleSelectService = (service: Service) => {
    if (appointmentData.service.type === service.title) {
      dispatch({ type: "DESELECT_SERVICE" });
    } else {
      dispatch({
        type: "SELECT_SERVICE",
        payload: {
          service: {
            type: service.title,
            price: service.price,
            duration: parseInt(service.duration),
          },
          physiotherapist: physioId,
        },
      });
    }
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
                appointmentData.service.type === svc.title
                  ? "border-blue-500 bg-blue-50"
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
    if (!appointmentData.service.type) {
      return (
        <p className="text-gray-800">
          Por favor selecciona un servicio primero.
        </p>
      );
    }
    // Calcula el GCD de las duraciones de todos los servicios para definir el slotInterval
    const serviceDurations = services.map((svc) => parseInt(svc.duration));
    const slotInterval = computeGCD(serviceDurations);
    return (
      <div>
        <h3 className="text-lg font-bold mb-4">Agenda tu cita</h3>
        <AppointmentCalendar
          serviceDuration={appointmentData.service.duration}
          slotInterval={slotInterval}
        />
      </div>
    );
  } else if (currentStep === 3) {
    // Se formatean las fechas de inicio y fin de forma separada
    const inicio = appointmentData.start_time
      ? formatAppointment(appointmentData.start_time)
      : { date: "", time: "" };
    const fin = appointmentData.end_time
      ? formatAppointment(appointmentData.end_time)
      : { time: "" };
    return (
      <div>
        <h3 className="font-bold mb-2">Resumen final de tu cita</h3>
        <p>
          <strong>Servicio:</strong> {appointmentData.service.type}
        </p>
        <p>
          <strong>Precio:</strong> ${appointmentData.service.price}
        </p>
        <p>
          <strong>Duración:</strong> {appointmentData.service.duration} min
        </p>
        {appointmentData.start_time ? (
          <>
            <p>
              <strong>Fecha:</strong> {inicio.date}
            </p>
            <p>
              <strong>Hora de inicio:</strong> {inicio.time}
            </p>
          </>
        ) : (
          <p>
            <strong>Inicio:</strong> No seleccionado
          </p>
        )}
        {appointmentData.end_time ? (
          <p>
            <strong>Hora de fin:</strong> {fin.time}
          </p>
        ) : (
          <p>
            <strong>Fin:</strong> No seleccionado
          </p>
        )}
      </div>
    );
  } else if (currentStep === 4) {
    return (
      <div>
        {/* <h3 className="text-lg font-bold mb-4">Elige tu método de pago</h3> */}
        <Elements stripe={stripePromise}>
          <React.StrictMode>
            <CheckoutForm request={appointmentData} />
          </React.StrictMode>
        </Elements>
      </div>
    );
  }
  return null;
};

export default WizardContent;
