// components/WizardNavigation.tsx
"use client";
import { useAppointment } from "@/context/appointmentContext";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/utils/api";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNext: () => void;
  goToPrevious: () => void;
  token: string | null;
  isClient: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  goToNext,
  goToPrevious,
  token,
  isClient,
}) => {
  const [currentRole, setCurrentRole] = useState("");
  const { state } = useAppointment();
  const appointmentData = state.appointmentData;
  const router = useRouter();

  // Obtener el rol actual del usuario mediante una petición de axios
  useEffect(() => {
    if (isClient) {
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            setCurrentRole(response.data.user_role);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  }, [isClient, token]);

  const createAppointment = () => {
    if (currentRole === "patient") {
      // Si el rol es 'patient', se procede a confirmar la cita
      if (isClient) {
        if (token) {
          axios
            .post(
              `${getApiBaseUrl()}/api/appointment/patient/`,
              {
                start_time: appointmentData?.start_time,
                end_time: appointmentData?.end_time,
                is_online: appointmentData?.is_online,
                service: appointmentData?.service,
                physiotherapist: appointmentData?.physiotherapist,
                status: "booked",
                alternatives: "",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              alert("La cita se realizó correctamente.");
              console.log("Cita realizada correctamente", response);
              // Redirigir a la pestaña 'mis-citas'
              router.push("/my-appointments");
            })
            .catch((error) => {
              console.error("Error en la creación de la cita:", error);
              alert("Hubo un problema con la conexión. Intenta nuevamente.");
            });
        } 
      }
    } else {
      // Si el rol no es 'patient', se muestra un mensaje y se redirige a la página de registro de paciente
      alert("Debe registrarse como paciente para confirmar la cita.");
      router.push("/login");
    }
  };

  return (
    <div className="flex justify-center space-x-4 mt-6">
      {currentStep !== 1 && (
        <button
          onClick={goToPrevious}
          className="px-6 py-2 rounded-xl bg-white border-2 border-[#65C2C9] text-[#65C2C9] hover:bg-[#65C2C9] hover:text-white transition-colors"
        >
          Atrás
        </button>
      )}
      {currentStep === totalSteps ? (
        <button
          onClick={createAppointment}
          className="px-6 py-2 rounded-xl bg-[#05668D] text-white hover:bg-[#05918F] transition-colors"
        >
          Finalizar
        </button>
      ) : (
        <button
          onClick={goToNext}
          className="px-6 py-2 rounded-xl bg-[#05668D] text-white hover:bg-[#05918F] transition-colors disabled:opacity-50"
          disabled={currentStep === totalSteps}
        >
          Siguiente
        </button>
      )}
    </div>
  );
};

export default WizardNavigation;