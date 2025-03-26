// Wizard.tsx
"use client";
import React, { useEffect, useState } from "react";
import WizardHeader from "./WizardHeader";
import WizardContent from "./WizardContent";
import WizardNavigation from "./WizardNavigation";
import { Service, Step } from "@/lib/definitions";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { useParams } from "next/navigation";

interface WizardProps {
  steps: Step[];
  token: string | null;
  isClient: boolean;
}

const Wizard: React.FC<WizardProps> = ({ steps, token, isClient }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);


  // 1) Cargar servicios del fisioterapeuta
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const urlParts = window.location.pathname.split("/");
        const physio_id = urlParts[urlParts.length - 1];
        if (physio_id) {
          const response = await axios.get(
            `${getApiBaseUrl()}/api/app_user/services/${physio_id}/`
          );
          const parsedServices: Service[] = [];
          let physioName = "";
  
          if (response.data && typeof response.data === "object") {
            // Obtener el nombre del fisioterapeuta
            physioName = response.data.physio_name || "";
  
            if (!response.data.services) {
              alert("Por favor, contacte con el administrador del servicio. Un fisioterapeuta ha configurado mal sus servicios")
              location.href=".."
            }

            Object.entries(response.data.services).forEach(
              ([_, service]: [string, any]) => {
                if (service && typeof service === "object" && "id" in service) {
                  const questionnaire =
                    service["cuestionario Personalizado"] || {};
                  parsedServices.push({
                    id: String(service.id),
                    title: service.title || "",
                    price:
                      typeof service.price === "number"
                        ? service.price
                        : parseFloat(service.price || "0"),
                    description: service.description || "",
                    duration: service.duration || "",
                    questionary: questionnaire["UI Schema"] || {
                      type: "",
                      label: "",
                      elements: [],
                    },
                  });
                }
              }
            );
          }
          setServices(parsedServices);
  
          sessionStorage.setItem("physioName", physioName);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    
    fetchServices();
    
  }, [token]);








  // 3) Control de pasos
  const goToNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const goToPreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full p-8">
      <div className="max-w-4xl mx-auto">
        {/* Modal de borrador */}
        
        <WizardHeader steps={steps} currentStep={currentStep} />

        <div className="mt-8 w-full bg-white rounded shadow p-6">
          <WizardContent currentStep={currentStep} services={services} />
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          goToNext={goToNextStep}
          goToPrevious={goToPreviousStep}
          token={token}
          isClient={isClient}
        />
      </div>
    </div>
  );
};

export default Wizard;
