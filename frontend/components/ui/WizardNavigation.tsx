// components/WizardNavigation.tsx
"use client";
import { useAppointment } from "@/context/appointmentContext";
import axios from "axios";
import React from "react";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  goToNext,
  goToPrevious,
}) => {

  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;

  const createAppointment = () => {
    const token = localStorage.getItem("token"); // Obtén el JWT desde localStorage (o desde donde lo tengas almacenado)
  
    axios.post(`http://localhost:8000/api/appointment/patient/`, {
      "start_time": appointmentData?.start_time,
      "end_time": appointmentData?.end_time,
      "is_online": appointmentData?.is_online,
      "service": appointmentData?.service,
      "physiotherapist": appointmentData?.physiotherapist,
      "status": "booked",
      "alternatives": ""
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Envía el JWT en la cabecera de la petición
      },
    })
      .then((response) => {
        // Si la respuesta fue exitosa
        alert("La cita se realizó correctamente.");
        console.log("Cita realizada correctamente", response);
        window.location.reload();
      })
      .catch((error) => {
        // Si hubo un error en la solicitud
        console.error("Error en la creación de la cita:", error);
        alert("Hubo un problema con la conexión. Intenta nuevamente.");
      });
  }

  return (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={goToPrevious}
        className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo2"
        disabled={currentStep === 1}
      >
        Atrás
      </button>
      {currentStep === totalSteps ? (
        <button
          onClick={createAppointment}
          className="px-4 py-2 bg-logo3 text-white rounded hover:bg-logo4"
        >
          Finalizar
        </button>
      ) : (
        <button
          onClick={goToNext}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo3"
          disabled={currentStep === totalSteps}
        >
          Siguiente
        </button>
      )}
    </div>
  );
}

export default WizardNavigation;
