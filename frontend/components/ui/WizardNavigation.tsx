// WizardNavigation.tsx
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
  const { state, dispatch } = useAppointment();
  const appointmentData = state.appointmentData;
  const router = useRouter();

  // Al montar, comprobamos el rol si existe un token
  useEffect(() => {
    if (isClient && token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          setCurrentRole(response.data.user_role);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [isClient, token]);

  // Función para crear la cita en el backend
  // const createAppointment = () => {
  //   if (!token) {
  //     setShowAuthModal(true);
  //     return;
  //   }

  //   if (currentRole !== "patient") {
  //     alert("Debes estar registrado como paciente para confirmar la cita.");
  //     router.push("/register");
  //     return;
  //   }

  //   axios
  //     .post(
  //       `${getApiBaseUrl()}/api/appointment/patient/`,
  //       {
  //         start_time: appointmentData.start_time,
  //         end_time: appointmentData.end_time,
  //         is_online: appointmentData.is_online,
  //         service: appointmentData.service,
  //         physiotherapist: appointmentData.physiotherapist,
  //         status: "booked",
  //         alternatives: "",
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     .then(() => {
  //       alert("La cita se realizó correctamente.");
  //       // Eliminamos el borrador unificado
  //       localStorage.removeItem("appointmentDraft");
  //       localStorage.removeItem("physioName");
  //       dispatch({ type: "DESELECT_SERVICE" });
  //       router.push("/my-appointments");
  //     })
  //     .catch((error) => {
  //       alert("Error en la creación de la cita: " + error);
  //     });
  // };

  // Función para guardar el borrador unificado y redirigir
  function handleDraftSaveAndRedirect(redirectPath: string) {
    // Clonamos el appointmentData para no mutar el original
    const safeDraft = { ...appointmentData };
    // Eliminamos cualquier info sensible si hace falta
    if (safeDraft.paymentInfo) delete safeDraft.paymentInfo;
    const name = localStorage.getItem("physioName");
    localStorage.removeItem("physioName");
    // Unificamos todo en un solo objeto
    const unifiedDraft = {
      appointmentData: safeDraft,
      draftInProgress: true,
      returnUrl: window.location.pathname,
      // Si quieres guardar también el nombre del fisio (ejemplo):
      physioName: name,
    };

    // Guardamos en una sola entrada del localStorage
    localStorage.setItem("appointmentDraft", JSON.stringify(unifiedDraft));
    router.push(redirectPath);
  }

  return (
    <>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={goToPrevious}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo2"
          disabled={currentStep === 1}
        >
          Atrás
        </button>
        {currentStep === totalSteps ? (
          <></>
          // <button
          //   onClick={createAppointment}
          //   className="px-4 py-2 bg-logo3 text-white rounded hover:bg-logo4"
          // >
          //   Finalizar
          // </button>
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

      
    </>
  );
};

export default WizardNavigation;
