"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./photo.scss";
import ScheduleCalendar from "@/components/ui/ScheduleCalendar";
import { getApiBaseUrl } from "@/utils/api";

const getAuthToken = () => {
    return localStorage.getItem("token"); // Obtiene el token JWT
};

const FisioProfile = () => {
    interface QuestionElement {
        type: string;
        label: string;
        scope: string;
    }

    interface Questionary {
        type: string;
        label: string;
        "UI Schema"?: {
            elements: QuestionElement[];
        };
    }

    // Actualizar la interfaz Service
    interface Service {
        id?: number;
        tipo: "PRIMERA_CONSULTA" | "CONTINUAR_TRATAMIENTO" | "OTRO";
        titulo: string;
        descripcion: string;
        precio: string;
        duracion: number; // En minutos
        custom_questionnaire?: Questionary;
    }

    const [profile, setProfile] = useState({
        user: {
            dni: "",
            email: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            photo: "",
            postal_code: "",
            user_id: "",
            username: "",
        },
        autonomic_community: "",
        bio: "",
        birth_date: "",
        collegiate_number: "",
        gender: "",
        rating_avg: "",
        schedule: "",
        services: [] as Service[],
    });

    const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [services, setServices] = useState<Service[]>([]);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [schedule, setSchedule] = useState({
        exceptions: {},
        appointments: [],
        weekly_schedule: {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
        },
        initialized: false,
    });
    const [isClient, setIsClient] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        fetchFisioProfile();
        return () => {
            if (profile.user.photo && profile.user.photo.startsWith('blob:')) {
                URL.revokeObjectURL(profile.user.photo);
            }
        };
    }, [token, isClient]);

    const fetchFisioProfile = async () => {
        if (isClient) {
            try {
                const storedToken = getAuthToken();
                setToken(storedToken)
                if (!storedToken) {
                    setError("No hay token disponible.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${getApiBaseUrl()}/api/app_user/current-user/`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                console.log("response.data.physio.services", response.data.physio.services);

                setProfile({
                    user: {
                        dni: response.data.physio.user_data.dni,
                        email: response.data.physio.user_data.email,
                        first_name: response.data.physio.user_data.first_name,
                        last_name: response.data.physio.user_data.last_name,
                        phone_number: response.data.physio.user_data.phone_number,
                        photo: response.data.physio.user_data.photo,
                        postal_code: response.data.physio.user_data.postal_code,
                        user_id: response.data.physio.user_data.user_id,
                        username: response.data.physio.user_data.username,
                    },
                    autonomic_community: response.data.physio.autonomic_community,
                    bio: response.data.physio.bio,
                    birth_date: response.data.physio.birth_date,
                    collegiate_number: response.data.physio.collegiate_number,
                    gender: response.data.physio.gender,
                    rating_avg: response.data.physio.rating_avg,
                    schedule: response.data.physio.schedule,
                    services: [],
                });
                try {
                    let parsedServices = [];
                    // Comprobar si los servicios son un string JSON o un array o un objeto
                    if (typeof response.data.physio.services === 'string') {
                        try {
                            parsedServices = JSON.parse(response.data.physio.services);
                        } catch (e) {
                            console.error("Error al parsear los servicios:", e);
                        }
                    } else if (Array.isArray(response.data.physio.services)) {
                        parsedServices = response.data.physio.services;
                    } else if (typeof response.data.physio.services === 'object') {
                        // Si es un objeto con claves (como en el ejemplo)
                        parsedServices = response.data.physio.services;
                    }

                    // Procesar los servicios dependiendo de su formato
                    let serviceList: Service[] = [];

                    // Si es un objeto con claves (como {Fisioterapia: {...}, Servicio 2: {...}})
                    if (parsedServices && typeof parsedServices === 'object' && !Array.isArray(parsedServices)) {
                        Object.entries(parsedServices).forEach(([key, value]: [string, any]) => {
                            serviceList.push({
                                id: value.id || null,
                                titulo: value.title || key,
                                tipo: value.tipo || "PRIMERA_CONSULTA",
                                descripcion: value.description || "",
                                precio: value.price ? `${value.price}€` : "",
                                duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                                custom_questionnaire: value["custom_questionnaire"] || null
                            });
                        });
                    } else if (Array.isArray(parsedServices)) {
                        // Si ya es un array
                        serviceList = parsedServices.map((service) => ({
                            id: service.id || null,
                            titulo: service.titulo || service.title || "",
                            tipo: service.tipo || "PRIMERA_CONSULTA",
                            descripcion: service.descripcion || service.description || "",
                            precio: service.precio || (service.price ? `${service.price}€` : ""),
                            duracion: service.duracion || (service.duration ? `${service.duration} minutos` : ""),
                            custom_questionnaire: service["custom_questionnaire"] || service.custom_questionnaire || null
                        }));
                    }

                    setServices(serviceList);
                    setProfile((prevProfile) => ({ ...prevProfile, services: serviceList }));
                } catch (e) {
                    console.error("Error al procesar los servicios:", e);
                    setServices([]);
                }
                if (response.data.physio.schedule) {
                    setSchedule(JSON.parse(response.data.physio.schedule));
                }
            } catch {
                setError("Error obteniendo el perfil.");
            } finally {
                setLoading(false);
            }
        }
    };


    // Funciones para gestionar servicios con la API
    const addServiceToAPI = async (serviceData: Service): Promise<number | null> => {
        try {
            console.log("serviceData", serviceData);
            // Preparar el servicio en el formato que espera el backend
            const serviceForBackend = {
                title: serviceData.titulo,
                description: serviceData.descripcion,
                price: parseFloat(serviceData.precio.replace('€', '').trim()),
                duration: serviceData.duracion,
                tipo: serviceData.tipo,
                custom_questionnaire: serviceData.custom_questionnaire ? {
                    "UI Schema": serviceData.custom_questionnaire
                } : null
            };

            const response = await axios.post(
                `${getApiBaseUrl()}/api/app_user/physio/add-service/`,
                serviceForBackend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return response.data.services;
        } catch (error: unknown) {
            console.error("Error al añadir servicio:", error);
            if (axios.isAxiosError(error) && error.response) {
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error al añadir el servicio.");
            }
            return null;
        }
    };

    const updateServiceInAPI = async (serviceId, serviceData) => {
        try {
            // Preparar el servicio en el formato que espera el backend
            const serviceForBackend = {
                title: serviceData.titulo,
                description: serviceData.descripcion,
                price: parseFloat(serviceData.precio.replace('€', '').trim()),
                duration: serviceData.duracion,
                tipo: serviceData.tipo,
                custom_questionnaire: serviceData.custom_questionnaire ? {
                    "UI Schema": serviceData.custom_questionnaire
                } : null
            };

            const response = await axios.put(
                `${getApiBaseUrl()}/api/app_user/physio/update-service/${serviceId}/`,
                serviceForBackend,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                return response.data.services;
            }
            else {
                throw new Error("Error al actualizar el servicio");
            }
        } catch (error) {
            console.error("Error al actualizar servicio:", error);
            if (error.response) {
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error al actualizar el servicio.");
            }
            return false;
        }
    };

    const deleteServiceFromAPI = async (serviceId) => {
        try {
            const response = await axios.delete(
                `${getApiBaseUrl()}/api/app_user/physio/delete-service/${serviceId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            return response.status === 204 || response.status === 200;
        } catch (error) {
            console.error("Error al eliminar servicio:", error);
            if (error.response) {
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error al eliminar el servicio.");
            }
            return false;
        }
    };




    const getScheduleSummary = () => {
        const daysOfWeek = {
            monday: "Lunes",
            tuesday: "Martes",
            wednesday: "Miércoles",
            thursday: "Jueves",
            friday: "Viernes",
            saturday: "Sábado",
            sunday: "Domingo",
        };

        return Object.entries(schedule.weekly_schedule)
            .map(([day, ranges]) => {
                if (ranges.length === 0) return null;

                const timeRanges = ranges.map((interval) => `${interval[0].start} - ${interval[0].end}`).join(", ");
                return `${daysOfWeek[day]}: ${timeRanges}`;
            })
            .filter(Boolean)
            .join("\n") || "No se ha configurado horario";
    };

    // Manejar actualizaciones del calendario
    const handleScheduleChange = (newSchedule) => {
        setSchedule(newSchedule);
    };

    // Validaciones de los campos editables
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "email":
                if (!value) error = "El email es obligatorio.";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Formato de email inválido.";
                break;
            case "phone_number":
                if (!value) error = "El teléfono es obligatorio.";
                else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
                else if (value.length > 15) error = "Máximo 15 dígitos.";
                break;
            case "postal_code":
                if (!value) error = "El código postal es obligatorio.";
                else if (!/^\d+$/.test(value)) error = "Solo se permiten números.";
                else if (value.length > 10) error = "Máximo 10 caracteres.";
                break;
            case "bio":
                if (value.length > 500) error = "Máximo 500 caracteres.";
                break;
        }

        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        return error === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        validateField(name, value); // Validar cada campo en tiempo real

        if (name === "bio") {
            setProfile((prevProfile) => ({ ...prevProfile, bio: value }));
        } else {
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: { ...prevProfile.user, [name]: value },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos antes de enviar
        const isValid = ["email", "phone_number", "postal_code", "bio"].every((field) =>
            validateField(field, (field === "bio" ? profile.bio : profile.user[field]) || "")
        );

        if (!isValid) {
            alert("Por favor, corrige los errores antes de enviar.");
            return;
        }

        try {
            if (!token) {
                setError("No hay token disponible.");
                return;
            }

            const formData = new FormData();
            Object.entries(profile.user).forEach(([key, value]) => {
                if (key !== "photo" && key !== "photoFile" && value) formData.append(`user.${key}`, value);
            });

            if (profile.user.photoFile) {
                formData.append("user.photo", profile.user.photoFile);
            }

            formData.append("gender", profile.gender || "");
            formData.append("birth_date", profile.birth_date || "");
            formData.append("autonomic_community", profile.autonomic_community || "");
            formData.append("collegiate_number", profile.collegiate_number || "");
            formData.append("bio", profile.bio || "");
            formData.append("rating_avg", profile.rating_avg || "");

            // Actualizar el schedule con los datos actuales del calendario
            const { initialized, ...scheduleWithoutInitialized } = schedule;
            formData.append("schedule", JSON.stringify(scheduleWithoutInitialized));

            // formData.append("services", JSON.stringify(services));

            const response = await axios.put(`${getApiBaseUrl()}/api/app_user/physio/update/`, formData, {
                headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                alert("Perfil actualizado correctamente");
                fetchFisioProfile();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error actualizando el perfil.");
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Crear URL para vista previa
            const previewUrl = URL.createObjectURL(file);

            // Actualizar el estado con el archivo y la URL de vista previa
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: {
                    ...prevProfile.user,
                    photo: previewUrl, // Para mostrar en la interfaz
                    photoFile: file,    // Para enviar al backend
                    preview: previewUrl
                },
            }));
        }
    };

    const getImageSrc = () => {
        // Verifica si hay un previewUrl (es decir, si el usuario ha subido una imagen)
        if (profile.user.preview) {
            return profile.user.photo; // Si existe una foto en el estado, usarla
        }

        // Si no existe un previewUrl, entonces usar la imagen del backend si está disponible
        if (profile?.user?.photo) {
            return `${getApiBaseUrl()}/api/app_user${profile.user.photo}`;
        }

        // Si no hay foto, usar la imagen por defecto
        return "/default_avatar.png";
    };

    const handleAddService = async (newService) => {
        try {
            if (editingServiceIndex !== null) {
                // Estamos editando un servicio existente
                const serviceToEdit = services[editingServiceIndex];

                if (serviceToEdit.id) {
                    // Actualizar en la API
                    const services = await updateServiceInAPI(serviceToEdit.id, newService);

                    if (services) {
                        const serviceList: Service[] = [];
                        // Actualizar el estado local solo si la API devuelve éxito
                        Object.entries(services).forEach(([key, value]: [string, any]) => {
                            serviceList.push({
                                id: value.id || null,
                                titulo: value.title || key,
                                tipo: value.tipo || "PRIMERA_CONSULTA",
                                descripcion: value.description || "",
                                precio: value.price ? `${value.price}€` : "",
                                duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                                custom_questionnaire: value["custom_questionnaire"] || null
                            });
                        });
                        setServices(serviceList);
                        setProfile(prev => ({ ...prev, services: serviceList }));
                        alert("Servicio actualizado correctamente");
                    } else {
                        alert("Error al actualizar el servicio");
                    }
                } else {
                    // Si no tiene ID pero estamos editando, es raro pero tratarlo como un nuevo servicio
                    const services = await addServiceToAPI(newService);

                    if (services) {
                        const serviceList: Service[] = [];
                        // Actualizar el estado local solo si la API devuelve éxito
                        Object.entries(services).forEach(([key, value]: [string, any]) => {
                            serviceList.push({
                                id: value.id || null,
                                titulo: value.title || key,
                                tipo: value.tipo || "PRIMERA_CONSULTA",
                                descripcion: value.description || "",
                                precio: value.price ? `${value.price}€` : "",
                                duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                                custom_questionnaire: value["custom_questionnaire"] || null
                            });
                        });
                        setServices(serviceList);
                        setProfile(prev => ({ ...prev, services: serviceList }));
                        alert("Servicio actualizado correctamente");
                    } else {
                        alert("Error al añadir el servicio");
                    }
                }
            } else {
                // Estamos añadiendo un nuevo servicio
                const services = await addServiceToAPI(newService);

                if (services) {
                    const serviceList: Service[] = [];
                    // Actualizar el estado local solo si la API devuelve éxito
                    Object.entries(services).forEach(([key, value]: [string, any]) => {
                        serviceList.push({
                            id: value.id || null,
                            titulo: value.title || key,
                            tipo: value.tipo || "PRIMERA_CONSULTA",
                            descripcion: value.description || "",
                            precio: value.price ? `${value.price}€` : "",
                            duracion: typeof value.duration === 'string' ? value.duration : `${value.duration} minutos`,
                            custom_questionnaire: value["custom_questionnaire"] || null
                        });
                    });
                    setServices(serviceList);
                    setProfile(prev => ({ ...prev, services: serviceList }));
                    alert("Servicio añadido correctamente");
                } else {
                    alert("Error al añadir el servicio");
                }
            }
        } catch (error) {
            console.error("Error al gestionar el servicio:", error);
            alert("Error al procesar la operación");
        } finally {
            setEditingServiceIndex(null);
            setShowServiceModal(false);
        }
    };


    const handleEditService = (index) => {
        setEditingServiceIndex(index);
        setShowServiceModal(true);
    };

    const handleDeleteService = async (index) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
            try {
                const serviceToDelete = services[index];

                if (serviceToDelete.id) {
                    // Eliminar de la API
                    const success = await deleteServiceFromAPI(serviceToDelete.id);

                    if (success) {
                        // Solo actualizar el estado local si la API devuelve éxito
                        const updatedServices = [...services];
                        updatedServices.splice(index, 1);
                        setServices(updatedServices);
                        setProfile(prev => ({ ...prev, services: updatedServices }));
                        alert("Servicio eliminado correctamente");
                    } else {
                        alert("Error al eliminar el servicio");
                    }
                } else {
                    // Si no tiene ID, es un servicio que nunca se guardó en la API
                    alert("No se puede eliminar un servicio que no ha sido guardado");
                }
            } catch (error) {
                console.error("Error al eliminar el servicio:", error);
                alert("Error al eliminar el servicio");
            }
        }
    };


    const ServiceModal = ({ onClose, onSave, editingService = null }: { onClose: () => void; onSave: (service: Service) => void; editingService?: Service | null }) => {
        // Inicializar con valores del servicio a editar o valores por defecto
        const [tipo, setTipo] = useState(editingService?.tipo || "PRIMERA_CONSULTA");
        const [titulo, setTitulo] = useState(editingService?.titulo || "");
        const [descripcion, setDescripcion] = useState(editingService?.descripcion || "");
        const [precio, setPrecio] = useState(editingService?.precio || "");
        const [duracion, setDuracion] = useState(() => {
            if (editingService) {
                if (typeof editingService.duracion === 'number') {
                    return String(editingService.duracion);
                } else if (typeof editingService.duracion === 'string') {
                    // Extraer solo los dígitos de la cadena
                    const match = editingService.duracion.match(/\d+/);
                    return match ? match[0] : "60";
                }
            }
            return "60"; // Valor por defecto
        });

        // Estado para gestionar el cuestionario
        const [showQuestionnaireSection, setShowQuestionnaireSection] = useState(() => {
            // Verificar si el servicio que estamos editando tiene un cuestionario
            if (editingService?.custom_questionnaire) {
                if (editingService.custom_questionnaire.elements ||
                    editingService.custom_questionnaire["UI Schema"]?.elements) {
                    return true;
                }
            }
            return false;
        });
        const [questionary, setQuestionary] = useState<Questionary>(() => {
            const defaultQuestionary: Questionary = {
                type: "Group",
                label: "Cuestionario Personalizado",
                elements: [
                    {
                        type: "Number",
                        label: "Peso (kg)",
                        scope: "#/properties/peso"
                    },
                    {
                        type: "Number",
                        label: "Altura (cm)",
                        scope: "#/properties/altura"
                    },
                    {
                        type: "Number",
                        label: "Edad",
                        scope: "#/properties/edad"
                    },
                    {
                        type: "Control",
                        label: "Nivel de actividad física",
                        scope: "#/properties/actividad_fisica"
                    },
                    {
                        type: "Control",
                        label: "Motivo de la consulta",
                        scope: "#/properties/motivo_consulta"
                    }
                ]
            };

            // Verificar todos los posibles formatos de cuestionario
            if (editingService?.custom_questionnaire) {
                // Si es un objeto directo con elementos
                if (editingService.custom_questionnaire.elements) {
                    return editingService.custom_questionnaire;
                }
                // Si tiene una estructura anidada con UI Schema
                else if (editingService.custom_questionnaire["UI Schema"]) {
                    return editingService.custom_questionnaire["UI Schema"];
                }
                // Si el propio objeto es el UI Schema
                else if (editingService.custom_questionnaire.type && editingService.custom_questionnaire.type === "Group") {
                    return editingService.custom_questionnaire;
                }
            }

            return defaultQuestionary;
        });

        // Para gestionar nuevas preguntas
        const [newQuestion, setNewQuestion] = useState("");
        const [questionType, setQuestionType] = useState("Control");


        // Generar ID único para scope basado en el texto de la pregunta
        const generateScope = (question: string) => {
            // Simplificar el texto para el scope, eliminar espacios, acentos, etc.
            const simplifiedText = question
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s]/g, "")
                .replace(/\s+/g, "_");

            return `#/properties/${simplifiedText}`;
        };

        // Añadir una nueva pregunta al cuestionario
        const addQuestion = () => {
            if (!newQuestion.trim()) return;

            const newElement = {
                type: questionType, // Usar el tipo seleccionado en el desplegable
                label: newQuestion,
                scope: generateScope(newQuestion)
            };

            setQuestionary({
                ...questionary,
                elements: [...questionary.elements, newElement]
            });

            setNewQuestion("");
            setQuestionType("Control"); // Restablecer al tipo predeterminado después de añadir
        };

        // Eliminar una pregunta del cuestionario
        const removeQuestion = (index: number) => {
            // No permitir eliminar las 5 primeras preguntas predeterminadas
            if (index < 5) return;

            const updatedElements = [...questionary.elements];
            updatedElements.splice(index, 1);

            setQuestionary({
                ...questionary,
                elements: updatedElements
            });
        };

        // Handle custom title based on type
        useEffect(() => {
            if (tipo === "PRIMERA_CONSULTA" && !editingService) {
                setTitulo("Primera consulta");
            } else if (tipo === "CONTINUAR_TRATAMIENTO" && !editingService) {
                setTitulo("Continuación de tratamiento");
            }
        }, [tipo]);

        const handleSave = () => {
            // Validación básica
            if (!titulo.trim()) {
                alert("El título es obligatorio");
                return;
            }

            if (!precio.trim()) {
                alert("El precio es obligatorio");
                return;
            }

            if (!duracion || parseInt(duracion) <= 0) {
                alert("La duración debe ser mayor a 0 minutos");
                return;
            }

            const newService = {
                tipo,
                titulo,
                descripcion,
                precio,
                duracion: parseInt(duracion),
                ...(showQuestionnaireSection ? { custom_questionnaire: questionary } : {})
            };

            onSave(newService);
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{editingService ? "Editar servicio" : "Añadir servicio"}</h2>

                    <label>Tipo de servicio:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value as string)}>
                        <option value="PRIMERA_CONSULTA">Primera consulta</option>
                        <option value="CONTINUAR_TRATAMIENTO">Continuar tratamiento</option>
                        <option value="OTRO">Otro</option>
                    </select>

                    <label>Título: <span className="required">*</span></label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        disabled={tipo !== "OTRO"}
                        className={!titulo.trim() ? "error-input" : ""}
                    />

                    <label>Descripción:</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Describe brevemente en qué consiste este servicio"
                    />

                    <label>Precio por consulta: <span className="required">*</span></label>
                    <input
                        type="text"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="€"
                        className={!precio.trim() ? "error-input" : ""}
                    />

                    <label>Duración (minutos): <span className="required">*</span></label>
                    <input
                        type="number"
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        min="1"
                        placeholder="60"
                        className={!duracion || parseInt(duracion) <= 0 ? "error-input" : ""}
                    />

                    <div className="questionnaire-toggle">
                        <label>
                            Incluir cuestionario pre-intervención
                            <input
                                type="checkbox"
                                checked={showQuestionnaireSection}
                                onChange={() => setShowQuestionnaireSection(!showQuestionnaireSection)}
                            />
                        </label>
                    </div>

                    {showQuestionnaireSection && (
                        <div className="questionnaire-section">
                            <p className="note">Las siguientes preguntas ya están incluidas por defecto:</p>

                            <ul className="questions-list">
                                {questionary && questionary.elements ? (
                                    questionary.elements.map((element, index) => (
                                        <li key={index} className={index < 5 ? "default-question" : ""}>
                                            {element.label}
                                            <span className="question-type-badge">
                                                {element.type === "Number" ? "Numérico" : "Texto"}
                                            </span>
                                            {index >= 5 && (
                                                <button
                                                    type="button"
                                                    className="remove-question"
                                                    onClick={() => removeQuestion(index)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li>No hay preguntas definidas en este cuestionario.</li>
                                )}
                            </ul>

                            <div className="add-question">
                                <label>Añadir nueva pregunta:</label>
                                <div className="question-input-group">
                                    <div className="question-type-select">
                                        <select
                                            value={questionType}
                                            onChange={(e) => setQuestionType(e.target.value)}
                                            className="question-type-dropdown"
                                        >
                                            <option value="Control">Texto</option>
                                            <option value="Number">Numérico</option>
                                        </select>
                                    </div>
                                    <div className="question-input">
                                        <input
                                            type="text"
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            placeholder="Ej. ¿Tiene alguna lesión previa?"
                                        />
                                        <button
                                            type="button"
                                            onClick={addQuestion}
                                            disabled={!newQuestion.trim()}
                                            className="add-question-button"
                                        >
                                            Añadir
                                        </button>
                                    </div>
                                </div>
                                <p className="type-hint">
                                    {questionType === "Control" ?
                                        "El campo de texto permite cualquier respuesta textual." :
                                        "El campo numérico solo permitirá introducir números."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button className="save-button" onClick={handleSave}>Guardar</button>
                        <button className="cancel-button" onClick={onClose}>Cancelar</button>
                    </div>
                </div>
            </div>
        );
    };



    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="user-profile-container">
            {/* Sección izquierda con la foto y datos principales */}
            <div className="user-profile-left">
                <div className="profile-pic">
                    <label className="-label" htmlFor="file">
                        <span className="glyphicon glyphicon-camera"></span>
                        <span>Change Image</span>
                    </label>
                    <input id="file" type="file" accept="image/*" onChange={handleFileChange} />
                    <img
                        src={getImageSrc()}
                        alt="Profile"
                        width="200"
                    />
                </div>
                <div className="user-info">
                    <p>{profile?.user?.username || "Nombre de usuario"}</p>
                    <p>{profile?.user?.first_name + " " + profile?.user?.last_name || "Nombre"}</p>
                    <p>DNI: {profile?.user?.dni || "No disponible"}</p>
                    <p>Número de colegiado: {profile?.collegiate_number || "No disponible"}</p>
                    <p>Colegio: {profile?.autonomic_community || "No disponible"}</p>
                </div>
                <div className="schedule-info">
                    <h2>Mi horario</h2>
                    <hr />
                    <p className="schedule-summary">{getScheduleSummary()}</p>
                    <button
                        className="edit-schedule-button"
                        onClick={() => setScheduleModalOpen(true)}
                    >
                        Editar horario
                    </button>
                </div>
            </div>

            {/* Sección derecha con el formulario */}
            <div className="user-profile-right">
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input type="email" name="email" value={profile.user.email} onChange={handleChange} />
                    <span className="error-message">{formErrors["email"]}</span>

                    <label>Teléfono:</label>
                    <input type="text" name="phone_number" value={profile.user.phone_number} onChange={handleChange} />
                    <span className="error-message">{formErrors["phone_number"]}</span>

                    <label>Código Postal:</label>
                    <input type="text" name="postal_code" value={profile.user.postal_code} onChange={handleChange} />
                    <span className="error-message">{formErrors["postal_code"]}</span>

                    <label>Biografía:</label>
                    <textarea
                        name="bio"
                        value={profile.bio ? profile.bio : ""}
                        onChange={handleChange}
                        rows={4}
                    />
                    <span className="error-message">{formErrors["bio"]}</span>

                    <button type="submit">Actualizar Perfil</button>
                </form>

                <div className="services-section">
                    <h2>Servicios</h2>
                    <hr />
                    {loading && (
                        <div className="loading-overlay">
                            <div className="loading-spinner"></div>
                            <p>Procesando...</p>
                        </div>
                    )}
                    <button
                        className="add-service-button"
                        onClick={() => {
                            setEditingServiceIndex(null);
                            setShowServiceModal(true);
                        }}
                    >
                        + Añadir servicio
                    </button>

                    {services.length === 0 ? (
                        <p className="no-services">No hay servicios registrados</p>
                    ) : (
                        <div className="service-list">
                            {services.map((service, index) => (
                                <div key={index} className="service-item">
                                    <div className="service-header">
                                        <h3>{service.titulo}</h3>
                                        <div className="service-type-badge">
                                            {service.tipo === "PRIMERA_CONSULTA"
                                                ? "Primera consulta"
                                                : service.tipo === "CONTINUAR_TRATAMIENTO"
                                                    ? "Continuación de tratamiento"
                                                    : "Otro"
                                            }
                                        </div>
                                    </div>

                                    {service.descripcion && (
                                        <p className="service-description">{service.descripcion}</p>
                                    )}

                                    <div className="service-details">
                                        <div className="detail-item">
                                            <span className="detail-icon">💰</span>
                                            <span>{service.precio}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">⏱️</span>
                                            <span>{service.duracion} minutos</span>
                                        </div>
                                        {(service.custom_questionnaire &&
                                            (service.custom_questionnaire.elements ||
                                                service.custom_questionnaire["UI Schema"]?.elements)) && (
                                                <div className="detail-item">
                                                    <span className="detail-icon">📋</span>
                                                    <span>Cuestionario preintervención incluido</span>
                                                </div>
                                            )}
                                    </div>


                                    <div className="service-actions">
                                        <button
                                            onClick={() => handleEditService(index)}
                                            className="edit-button"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(index)}
                                            className="delete-button"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal para añadir/editar servicios */}
                {showServiceModal && (
                    <ServiceModal
                        onClose={() => {
                            setShowServiceModal(false);
                            setEditingServiceIndex(null);
                        }}
                        onSave={handleAddService}
                        editingService={editingServiceIndex !== null ? services[editingServiceIndex] : undefined}
                    />
                )}

                {/* Modal para editar el horario */}
                {scheduleModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            {/* Botón de cierre en la esquina superior derecha */}
                            <button className="modal-close-button" onClick={() => setScheduleModalOpen(false)}>
                                &times;
                            </button>

                            <h2>Editar horario</h2>
                            <ScheduleCalendar
                                initialSchedule={schedule}
                                onScheduleChange={setSchedule}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default FisioProfile;
