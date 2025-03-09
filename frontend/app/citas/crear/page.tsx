// app/page.tsx
"use client";
import React from "react";
import Wizard from "@/components/ui/wizard";
import { Step } from "@/lib/definitions";
import { AppointmentProvider } from "@/context/appointmentContext";


const steps: Step[] = [
  { step: 1, label: "Selecciona el servicio" },
  { step: 2, label: "Agenda tu cita y hora" },
  { step: 3, label: "Elige tu método de pago" },
  { step: 4, label: "Resumen final" },
];


export default function WizardPage() {

  return (
    <AppointmentProvider>
      <Wizard steps={steps} />
    </AppointmentProvider>
  );
}