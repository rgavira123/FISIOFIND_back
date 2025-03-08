"use client";

import WizardLG from "@/components/ui/wizard-lg";
import WizardSM from "@/components/ui/wizard-sm";

export default function CreateAppointment() {
  const steps = [
    { step: 1, label: "Selecciona el servicio" },
    { step: 2, label: "Agenda tu cita y hora" },
    { step: 3, label: "Método de pago" },
    { step: 4, label: "Resumen final" },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <WizardLG steps={steps} />
      <WizardSM steps={steps} />
    </div>
  );
}
