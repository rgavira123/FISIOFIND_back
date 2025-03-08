"use client";
import React, { useState } from "react";

export default function WizardSM({
  steps,
}: {
  steps: { step: number; label: string }[];
}) {
  // Estado para controlar el paso actual
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Funciones para avanzar y retroceder pasos
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  function getBgColor(s: number): string {
    // isCompleted, isActive, future
    if (s < currentStep) return "#05AC9C"; // Paso completado
    if (s === currentStep) return "#05668D"; // Paso actual
    return "#65C2C9"; // Pasos futuros
  }

  return (
    <div className="flex lg:hidden flex-col items-center justify-center p-4 w-10/12">
      {/* Wizard en forma de bolitas */}
      <div className="flex items-center space-x-1">
        {steps.map((s) => {
          const bgColor = getBgColor(s.step);
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div key={s.step} className="flex flex-col items-center">
              {/* Circulito para el paso */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: bgColor }}
              >
                {isCompleted ? "✓" : s.step}
              </div>
              {/* Label debajo de la bolita */}
              <span className="text-xs mt-1 text-gray-700 text-center">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contenido dinámico */}
      <div className="mt-8 w-full max-w-md bg-white rounded shadow p-6">
        {currentStep === 1 && (
          <p className="text-gray-800">Contenido: Selecciona el servicio.</p>
        )}
        {currentStep === 2 && (
          <p className="text-gray-800">Contenido: Agenda tu cita y hora.</p>
        )}
        {currentStep === 3 && (
          <p className="text-gray-800">Contenido: Elige tu método de pago.</p>
        )}
        {currentStep === 4 && (
          <p className="text-gray-800">Contenido: Resumen final de tu cita.</p>
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={goToPreviousStep}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          disabled={currentStep === 1}
        >
          Atrás
        </button>
        <button
          onClick={goToNextStep}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
          disabled={currentStep === steps.length}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
