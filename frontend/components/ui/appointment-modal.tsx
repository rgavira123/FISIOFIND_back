import axios from "axios";
import { CalendarProps } from "@/lib/definitions";
import Image from "next/image";
import AlternativeSelector from "./alternative-selector";
import { getApiBaseUrl } from "@/utils/api";
import { useState, useEffect, useRef } from "react"; // Agregar useRef y useEffect

// Función para formatear fechas
const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

interface AppointmentModalProps {
  selectedEvent: CalendarProps | null;
  currentRole: string;
  setSelectedEvent: (event: CalendarProps | null) => void;
  setEditionMode: (mode: boolean) => void;
  isClient: boolean;
  token: string | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  selectedEvent,
  currentRole,
  setSelectedEvent,
  setEditionMode,
  isClient,
  token,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [modalMaxHeight, setModalMaxHeight] = useState("85vh"); // Estado para la altura máxima
  const modalContentRef = useRef<HTMLDivElement>(null); // Referencia para medir el contenido

  // Efecto para ajustar la altura máxima del modal
  useEffect(() => {
    const handleResize = () => {
      setModalMaxHeight(`${window.innerHeight * 0.85}px`);
    };
    
    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedEvent(null);
    }, 200);
  };

  const getStatusBadge = () => {
    if (!selectedEvent) return null;

    const statusClasses = {
      booked: "bg-yellow-500 text-yellow-50",
      confirmed: "bg-green-500 text-green-50",
      finished: "bg-gray-500 text-gray-50",
      canceled: "bg-red-500 text-red-50",
    };

    const statusText = {
      booked: "Reservada",
      confirmed: "Confirmada",
      finished: "Finalizada",
      canceled: "Cancelada",
    };

    const statusClass = statusClasses[selectedEvent.status] || "bg-gray-300 text-gray-700";
    const statusLabel = statusText[selectedEvent.status] || "Desconocido";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
      >
        {statusLabel}
      </span>
    );
  };

  if (!selectedEvent) return null;
  const deleteEvent = (selectedEvent: CalendarProps | null) => {
    if (!selectedEvent) return;
    if (isClient) {
      if (token) {
        axios
          .delete(
            `${getApiBaseUrl()}/api/appointment/delete/${selectedEvent.id}/`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((response) => {
            const status = response.status;
            if (status == 204) {
              alert("La cita fue cancelada correctamente.");
              setSelectedEvent(null);
              window.location.reload();
            }
          })
          .catch((error) => {
            if (error.response) {
              const msg = error.response.data.error;
              alert(msg);
            }
          });
      }
    }
  };

  const handleSelection = (date: string, startTime: string) => {
    const [startTimeSplit, endTimeSplit] = startTime.split(" - ");
    const startDateTime = new Date(
      `${date}T${startTimeSplit}:00Z`
    ).toISOString();
    const endDateTime = new Date(`${date}T${endTimeSplit}:00Z`).toISOString();

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${selectedEvent?.id}/`,
        {
          start_time: startDateTime,
          end_time: endDateTime,
          status: "confirmed",
          alternatives: selectedEvent?.alternatives,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        alert("La cita se actualizó correctamente.");
        console.log("Cita actualizada correctamente", response);
        setSelectedEvent(null);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error en la actualización de la cita:", error);
        alert("Hubo un problema con la conexión. Intenta nuevamente.");
      });
  };

  const confirmAppointment = () => {
    if (!selectedEvent || !token) return;

    axios
      .put(
        `${getApiBaseUrl()}/api/appointment/update/${
          selectedEvent.id
        }/confirm/`,
        {
          status: "confirmed",
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        const message = response.data.message;
        alert(message);
        setSelectedEvent(null);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          const msg = error.response.data.error;
          alert(msg);
        }
      });
  };

  const isFutureAndTwoDaysAhead = () => {
    const eventStart = new Date(selectedEvent?.start);
    const now = new Date();
    const diffInMs = eventStart.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 3600 * 24);
    return diffInDays >= 2;
  };

  return (
    <div
      className={`z-50 fixed inset-0 flex items-center justify-center ${isClosing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 overflow-hidden`}
      onClick={closeModal}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm"></div>
      
      {/* Modal Card - Con altura máxima y scroll */}
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 relative z-50 flex flex-col ${isClosing ? 'scale-95' : 'scale-100'} transition-all duration-200`}
        onClick={(event) => event.stopPropagation()}
        style={{ maxHeight: modalMaxHeight }}
      >
        {/* Header - Fijo */}
        <div className="relative flex-shrink-0">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 pt-12 pb-6">
            <div className="flex justify-between items-start">
              <h2 
                id="modal-title"
                className="text-white text-xl font-medium truncate max-w-xs"
              >
                {selectedEvent.title}
              </h2>
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center mt-4 text-teal-50">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="text-sm capitalize">
                {formatDateTime(selectedEvent.start)}
              </span>
            </div>
            
            {selectedEvent.end && (
              <div className="flex items-center mt-2 text-teal-50">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-sm">
                  Duración: {selectedEvent.end && selectedEvent.start ? Math.round((new Date(selectedEvent.end).getTime() - new Date(selectedEvent.start).getTime()) / (1000 * 60)) : 0} minutos
                </span>
              </div>
            )}
          </div>
          
          {/* Close button */}
          <button
            className="absolute top-3 right-3 bg-teal-400 bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 rounded-full transition-colors duration-150"
            onClick={closeModal}
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Content - Con scroll */}
        <div 
          ref={modalContentRef}
          className="p-6 overflow-y-auto flex-grow"
        >
          {/* Description */}
          {selectedEvent.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles</h3>
              <p className="text-gray-700">{selectedEvent.description}</p>
            </div>
          )}
          
          {/* Service info if available */}
          {selectedEvent.service && selectedEvent.service.type && (
            <div className="mb-6 bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Servicio</span>
                <span className="text-sm text-gray-700">{selectedEvent.service.type}</span>
              </div>
              {selectedEvent.service.duration > 0 && (
                <div className="flex justify-between mt-1">
                  <span className="text-sm font-medium text-gray-500">Duración</span>
                  <span className="text-sm text-gray-700">{selectedEvent.service.duration} minutos</span>
                </div>
              )}
            </div>
          )}
          
          {/* Questionary responses - Solo visible para fisioterapeutas */}
          {currentRole === "physiotherapist" && 
           selectedEvent.service?.questionaryResponses && 
           Object.keys(selectedEvent.service.questionaryResponses).length > 0 && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-teal-700 mb-3 pb-2 border-b border-gray-200">
                Información del paciente
              </h3>
              
              <div className="space-y-4">
                {/* Sección de datos personales comunes */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Datos básicos
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Mostrar peso con unidad */}
                    {selectedEvent.service.questionaryResponses.peso && (
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Peso:</span> 
                        <span className="text-sm text-gray-800">{selectedEvent.service.questionaryResponses.peso} kg</span>
                      </div>
                    )}
                    
                    {/* Mostrar altura con unidad */}
                    {selectedEvent.service.questionaryResponses.altura && (
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Altura:</span> 
                        <span className="text-sm text-gray-800">{selectedEvent.service.questionaryResponses.altura} cm</span>
                      </div>
                    )}
                    
                    {/* Mostrar edad con unidad */}
                    {selectedEvent.service.questionaryResponses.edad && (
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Edad:</span> 
                        <span className="text-sm text-gray-800">{selectedEvent.service.questionaryResponses.edad} años</span>
                      </div>
                    )}
                    
                    {/* Nivel de actividad física */}
                    {selectedEvent.service.questionaryResponses.actividad_fisica && (
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Nivel de actividad:</span> 
                        <span className="text-sm text-gray-800">{selectedEvent.service.questionaryResponses.actividad_fisica}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Motivo de consulta - con más espacio ya que suele ser texto largo */}
                {selectedEvent.service.questionaryResponses.motivo_consulta && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Motivo de consulta
                    </h4>
                    <div className="bg-white p-3 rounded border border-gray-100">
                      <p className="text-sm text-gray-800">{selectedEvent.service.questionaryResponses.motivo_consulta}</p>
                    </div>
                  </div>
                )}
                
                {/* Otras preguntas personalizadas */}
                {Object.entries(selectedEvent.service.questionaryResponses)
                  .filter(([key]) => !['peso', 'altura', 'edad', 'actividad_fisica', 'motivo_consulta'].includes(key))
                  .length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Información adicional
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(selectedEvent.service.questionaryResponses)
                          .filter(([key]) => !['peso', 'altura', 'edad', 'actividad_fisica', 'motivo_consulta'].includes(key))
                          .map(([key, value], index) => (
                            <div key={index} className="py-1.5 border-b border-gray-100 last:border-0">
                              <div className="text-sm font-medium text-gray-600 mb-1">{key}:</div>
                              <div className="text-sm text-gray-800 break-words">{String(value)}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
          
          {/* Alternatives selector */}
          {selectedEvent.alternatives && currentRole === "patient" && (
            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Opciones alternativas</h3>
              <AlternativeSelector
                alternatives={selectedEvent.alternatives}
                onConfirmSelection={handleSelection}
              />
            </div>
          )}
          
          {/* Action buttons - Ahora van dentro del área con scroll */}
          {selectedEvent.status !== "finished" && (
            <div className="flex flex-wrap gap-3 mt-6 justify-end">
              {currentRole === "physiotherapist" && selectedEvent.status === "booked" && isFutureAndTwoDaysAhead() && (
                <button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center"
                  onClick={confirmAppointment}
                >
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Confirmar cita
                </button>
              )}
              
              {currentRole === "physiotherapist" && (
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center"
                  onClick={() => setEditionMode(true)}
                >
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Modificar cita
                </button>
              )}
              
              {selectedEvent && new Date(selectedEvent.start) > new Date() && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center"
                  onClick={() => deleteEvent(selectedEvent)}
                >
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Cancelar cita
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AppointmentModal };