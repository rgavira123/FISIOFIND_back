// components/WizardNavigation.tsx
"use client";
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
}) => (
  <div className="flex space-x-4 mt-6">
    <button
      onClick={goToPrevious}
      className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo2"
      disabled={currentStep === 1}
    >
      Atrás
    </button>
    <button
      onClick={goToNext}
      className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50 hover:bg-logo3"
      disabled={currentStep === totalSteps}
    >
      Siguiente
    </button>
  </div>
);

export default WizardNavigation;
