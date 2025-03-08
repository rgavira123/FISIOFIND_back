"use client";
import React, { useState } from "react";

// Pasos de tu proceso


export default function WizardLG({ steps }: { steps: { step: number; label: string }[] }) {    
  // Estado para controlar el paso actual
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Funciones para avanzar y retroceder pasos
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="hidden lg:flex flex-col items-center justify-center p-8">
      {/* Encabezado con los pasos en forma de chevron */}
      <div className="flex items-center space-x-2">
        {steps.map((s) => {
          // Determina si el paso está completado, activo o pendiente
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          // Colores de fondo según el estado del paso (puedes adaptarlos a tu paleta)
          let bgColor = "#65C2C9"; // color para pasos futuros
          if (isCompleted) bgColor = "#05AC9C"; // pasos completados
          if (isActive) bgColor = "#05668D";    // paso actual

          return (
            <div
              key={s.step}
              className="relative flex flex-col items-center justify-center text-white px-6 py-2 min-w-[160px] text-center"
              style={{
                backgroundColor: bgColor,
                // Forma trapezoidal/chevron en ambos lados
                clipPath:
                  "polygon(85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%, 0% 0%)",
              }}
            >
            <div className = "px-4 py-2 flex flex-col items-center justify-center text-white min-w-52">
              <span className="font-semibold">Paso {s.step}</span>
              <span className="text-sm">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contenido dinámico según el paso */}
      <div className="mt-8 w-full max-w-xl bg-white rounded shadow p-6">
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

      {/* Botones para navegar entre pasos */}
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
