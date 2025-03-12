// Wizard.tsx
"use client";
import React, { useEffect, useState } from "react";
import WizardHeader from "./WizardHeader";
import WizardContent from "./WizardContent";
import WizardNavigation from "./WizardNavigation";
import { Service, Step } from "@/lib/definitions";
import { AppointmentProvider, useAppointment } from "@/context/appointmentContext"; // Asegúrate de ajustar la ruta
import { useRouter } from "next/router";
import { useParams } from "next/navigation";

const Wizard: React.FC<{ steps: Step[] }> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const services: Service[] = [
    {
      id: "1",
      title: "Masaje Deportivo",
      price: 50,
      description:
        "Masaje enfocado en aliviar tensiones musculares de deportistas.",
      duration: "45",
    },
    {
      id: "2",
      title: "Rehabilitación de Rodilla",
      price: 80,
      description: "Terapia para mejorar la movilidad y reducir el dolor.",
      duration: "60",
    },
  ];

  // Navegación
  const goToNextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 1));

  const params = useParams();
  console.log(params);
  const { id } = useParams();
  const { dispatch } = useAppointment();

  useEffect(() => {
    if (id) {
      // Si id es un string, conviértelo a número si es necesario
      const physioId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
      dispatch({ type: "SELECT_PHYSIOTHERAPIST", payload: physioId });
    }
  }, [id, dispatch]);

  return (
    <AppointmentProvider>
      <div className="w-full p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <WizardHeader steps={steps} currentStep={currentStep} />

          {/* Contenido */}
          <div className="mt-8 w-full bg-white rounded shadow p-6">
            <WizardContent currentStep={currentStep} services={services} />
          </div>

          {/* Navegación */}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            goToNext={goToNextStep}
            goToPrevious={goToPreviousStep}
          />
        </div>
      </div>
    </AppointmentProvider>
  );
};

export default Wizard;
