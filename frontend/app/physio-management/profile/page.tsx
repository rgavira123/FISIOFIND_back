"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./photo.css";
import ScheduleCalendar from "@/components/ui/ScheduleCalendar";
import { getApiBaseUrl } from "@/utils/api";
import { GradientButton } from "@/components/ui/gradient-button";
import { Mail, Phone, MapPin, FileText, Lock, Save } from "lucide-react";
import ServiceEditModal from "@/components/service-edit-modal";
import ServiceModal from "@/components/service-create-modal";

const getAuthToken = () => {
    return localStorage.getItem("token"); // Obtiene el token JWT
};

const FisioProfile = () => {
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
        services: ""
    });

    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [services, setServices] = useState<Record<string, any>>({});
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
    interface PendingChanges {
        dni?: string;
        password?: string;
    }

    const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [oldPassword, setOldPassword] = useState(""); // State for old password

    const [showEditServiceModal, setShowEditServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedServiceName, setSelectedServiceName] = useState("");

    useEffect(() => {
        setIsClient(true);
    }, []);

    interface Service {
        titulo: string;
        descripcion: string;
        precio: string;
        frecuencia: string;
        duracion: string;
    }

    const handleAddService = async (newService: Service) => {
        const updatedServices = { ...services, [newService.titulo]: newService };
        setServices(updatedServices);

        try {
            const storedToken = getAuthToken();
            if (!storedToken) {
                alert("No hay token disponible.");
                return;
            }

            const response = await axios.post(
                `${getApiBaseUrl()}/api/app_user/physio/create-service/`,
                { services: updatedServices },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );

            if (response.status === 200) {
                console.log("Servicio añadido correctamente.");
                setShowServiceModal(false); // Close the modal
            }
        } catch (error) {
            console.error("Error añadiendo servicio:", error);
            alert("Error añadiendo servicio.");
        }
    };

    const handleServiceClick = (key, service) => {
        setSelectedService(service);
        setSelectedServiceName(key);
        setShowEditServiceModal(true);
    };

    const handleDeleteService = async (serviceName) => {
        try {
            const storedToken = getAuthToken();
            if (!storedToken) {
                alert("No hay token disponible.");
                return;
            }
    
            console.log(`Deleting service: ${serviceName}`); // Add this for debugging
            
            // Call the delete endpoint directly
            const response = await axios.delete(
                `${getApiBaseUrl()}/api/app_user/physio/delete-service/${serviceName}/`,
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );
    
            if (response.status === 200) {
                console.log("Servicio eliminado correctamente.");
                
                // Update local state
                const updatedServices = { ...services };
                delete updatedServices[serviceName];
                setServices(updatedServices);
                
                // Close the modal
                setShowEditServiceModal(false);
            }
        } catch (error) {
            console.error("Error eliminando servicio:", error);
            alert(`Error eliminando servicio: ${error.response?.data?.error || error.message}`);
        }
    };

    // Update the handleUpdateService function
    const handleUpdateService = async (serviceName, updatedService) => {
        try {
            // Create a copy of the services object
            const updatedServices = { ...services };
            
            // If the service name has changed, remove the old one
            if (serviceName !== updatedService.titulo) {
                delete updatedServices[serviceName];
            }
            
            // Add/update the service with the new title as key
            updatedServices[updatedService.titulo] = updatedService;
            
            // Update local state
            setServices(updatedServices);
            
            // Close the modal
            setShowEditServiceModal(false);
            
            // Send the updated services to the backend
            const storedToken = getAuthToken();
            if (!storedToken) {
                alert("No hay token disponible.");
                return;
            }

            const response = await axios.post(
                `${getApiBaseUrl()}/api/app_user/physio/create-service/`,
                { services: updatedServices },
                { headers: { Authorization: `Bearer ${storedToken}` } }
            );

            if (response.status === 200) {
                console.log("Servicio actualizado correctamente.");
            }
        } catch (error) {
            console.error("Error actualizando servicio:", error);
            alert("Error actualizando servicio.");
        }
    };

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
                setToken(storedToken);
                if (!storedToken) {
                    setError("No hay token disponible.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${getApiBaseUrl()}/api/app_user/current-user/`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });

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
                    services: response.data.physio.services,
                });

                // Parse services if they are in string format
                if (response.data.physio.services) {
                    setServices(
                        typeof response.data.physio.services === "string"
                            ? JSON.parse(response.data.physio.services)
                            : response.data.physio.services
                    );
                }

                // Parse schedule if it is in string format
                if (response.data.physio.schedule) {
                    setSchedule(
                        typeof response.data.physio.schedule === "string"
                            ? JSON.parse(response.data.physio.schedule)
                            : response.data.physio.schedule
                    );
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Error obteniendo el perfil.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Manejar actualizaciones del calendario
    const handleScheduleChange = (newSchedule: typeof schedule) => {
        setSchedule(newSchedule);
    };

    // Validaciones de los campos editables
    const validateField = (name: string, value: string) => {
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
                // Only validate max length if bio has content
                if (value && value.length > 500) error = "Máximo 500 caracteres.";
                break;
        }

        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
        return error === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        validateField(name, value);

        if (name === "bio") {
            setProfile((prevProfile) => ({ ...prevProfile, bio: value }));
        } else {
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: { ...prevProfile.user, [name]: value },
            }));
        }
    };

    const handleSensitiveChange = (e) => {
        const { name, value } = e.target;

        setPendingChanges((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    const confirmSensitiveChanges = async () => {
        if (pendingChanges.password && !oldPassword) {
            setFormErrors((prev) => ({ ...prev, password: "Debes ingresar tu contraseña actual para actualizar la contraseña." }));
            return;
        }
    
        // Update the profile state with pending changes
        setProfile((prevProfile) => ({
            ...prevProfile,
            user: {
                ...prevProfile.user,
                ...pendingChanges,
            },
        }));
        
        // Add old password to form data if changing password
        if (pendingChanges.password) {
            setPendingChanges((prev) => ({
                ...prev,
                old_password: oldPassword
            }));
        }
        
        // Close the confirmation modal
        setShowConfirmation(false);
        
        // Call the profile update function after confirming changes
        await handleSubmit();
    };
    
    const cancelSensitiveChanges = () => {
        setPendingChanges({});
        setShowConfirmation(false);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault(); // Prevent default only if event is provided
    
        // Check if sensitive fields have been changed
        if ((pendingChanges.dni || pendingChanges.password) && !showConfirmation) {
            setShowConfirmation(true);
            return;
        }
    
        // Validate all fields before submitting
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
            
            // Add user data to formData
            Object.entries(profile.user).forEach(([key, value]) => {
                if (key !== "photoFile" && key !== "preview" && value !== undefined && key !== "photo") {
                    formData.append(`user.${key}`, value);
                }
            });
    
            // Include the photo file if it exists
            if (profile.user.photoFile) {
                formData.append("photo", profile.user.photoFile);
            }
    
            // Handle DNI change properly - use the pending change if it exists
            if (pendingChanges.dni) {
                formData.append("user.dni", pendingChanges.dni);
            }
            
            // Handle password change
            if (pendingChanges.password) {
                formData.append("user.password", pendingChanges.password);
                formData.append("user.old_password", oldPassword);
            }
    
            formData.append("gender", profile.gender || "");
            formData.append("birth_date", profile.birth_date || "");
            formData.append("autonomic_community", profile.autonomic_community || "");
            formData.append("collegiate_number", profile.collegiate_number || "");
            if (profile.bio && profile.bio.trim() !== "") {
                formData.append("bio", profile.bio.trim());
              }
            formData.append("rating_avg", profile.rating_avg || "");
    
            const { initialized, ...scheduleWithoutInitialized } = schedule;
            formData.append("schedule", JSON.stringify(scheduleWithoutInitialized));
            formData.append("services", JSON.stringify(services));
    
            // Log the form data for debugging
            console.log("FormData being sent:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${typeof value === 'object' ? 'File object' : value}`);
            }
    
            const response = await axios.put(`${getApiBaseUrl()}/api/app_user/physio/update/`, formData, {
                headers: { 
                    Authorization: "Bearer " + token, 
                    "Content-Type": "multipart/form-data" 
                },
            });
    
            if (response.status === 200) {
                console.log("Perfil actualizado correctamente");
                // Clear the preview and photoFile after successful update
                if (profile.user.preview) {
                    URL.revokeObjectURL(profile.user.preview);
                }
                
                // Update the profile state with the new DNI value
                if (pendingChanges.dni) {
                    setProfile(prev => ({
                        ...prev,
                        user: {
                            ...prev.user,
                            dni: pendingChanges.dni,
                            photoFile: undefined,
                            preview: undefined
                        }
                    }));
                } else {
                    setProfile(prev => ({
                        ...prev,
                        user: {
                            ...prev.user,
                            photoFile: undefined,
                            preview: undefined
                        }
                    }));
                }
                
                // Clear pending changes and old password
                setPendingChanges({});
                setOldPassword("");
                
                fetchFisioProfile(); // Refresh profile data
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                alert(`Error: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Error actualizando el perfil.");
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Revoke previous preview URL if exists
            if (profile.user.preview) {
                URL.revokeObjectURL(profile.user.preview);
            }
            
            // Create URL for preview
            const previewUrl = URL.createObjectURL(file);

            // Update the state with the file and preview URL
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: {
                    ...prevProfile.user,
                    photoFile: file,   // For sending to the backend
                    preview: previewUrl // For displaying in the UI
                },
            }));
        }
    };

    const getImageSrc = () => {
        // If there's a preview URL (user has uploaded a new image)
        if (profile.user.preview) {
            return profile.user.preview;
        }

        // If there's a photo from the backend
        if (profile?.user?.photo) {
            // Check if the photo is already a full URL
            if (profile.user.photo.startsWith('http')) {
                return profile.user.photo;
            }
            // Otherwise, construct the URL
            return `${getApiBaseUrl()}${profile.user.photo}`;
        }

        // Default avatar if no photo is available
        return "/default_avatar.png";
    };


    if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center p-5" 
               style={{ backgroundColor: "rgb(238, 251, 250)" }}>
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      }
      if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-7xl mx-auto bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
         style={{ backgroundColor: "rgb(238, 251, 250)" }}>
            <div className="md:flex md:gap-8">
                {/* Left Section */}
                <div className="md:w-1/3">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-32 h-32 mb-4">
                                <img
                                    src={getImageSrc()}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full border-4 border-white shadow"
                                />
                                <label 
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-colors"
                                    htmlFor="file"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </label>
                                <input id="file" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </div>
                            
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {profile?.user?.first_name + " " + profile?.user?.last_name || "Nombre"}
                            </h2>
                            <p className="text-gray-500">@{profile?.user?.username || "usuario"}</p>
                        </div>
                        
                        {/* User Info Cards */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                <div className="text-blue-500 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">DNI</p>
                                    <p className="font-medium">{profile?.user?.dni || "No disponible"}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                <div className="text-blue-500 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Número de colegiado</p>
                                    <p className="font-medium">{profile?.collegiate_number || "No disponible"}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                <div className="text-blue-500 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Colegio</p>
                                    <p className="font-medium">{profile?.autonomic_community || "No disponible"}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Services Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Servicios </h2>
                                <GradientButton 
                                    variant="create"
                                    onClick={() => setShowServiceModal(!showServiceModal)}
                                    className="px-1 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>Añadir servicio</span>
                                </GradientButton>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4">
                                {Object.keys(services).length === 0 ? (
                                    <p className="text-gray-500 text-center py-6">No hay servicios añadidos aún.</p>
                                ) : (
                                <div className="grid gap-4 md:grid-cols-1">
                                    {Object.entries(services).map(([key, service]) => (
                                        <div
                                        key={key}
                                        className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100 overflow-hidden group w-full"
                                        onClick={() => handleServiceClick(key, service)}
                                       >
                                         {/* Header section with title and optional tag */}
                                         <div className="flex justify-between items-center p-4 pb-2 border-b border-gray-100">
                                           <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                                             {service.titulo}
                                           </h3>
                                           <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                             Servicio
                                           </span>
                                         </div>
                                       
                                         {/* Description */}
                                         <p className="text-gray-600 text-sm px-4 py-3 leading-relaxed">
                                           {service.descripcion}
                                         </p>
                                       
                                         {/* Details section with icons */}
                                         <div className="px-4 pb-4 space-y-2 text-sm">
                                           <div className="flex items-center justify-between">
                                             <div className="flex items-center text-gray-500">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                               </svg>
                                               <span>Precio:</span>
                                             </div>
                                             <span className="font-semibold text-gray-800">{service.precio}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                             <div className="flex items-center text-gray-500">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                               </svg>
                                               <span>Frecuencia:</span>
                                             </div>
                                             <span className="text-gray-700">{service.frecuencia}</span>
                                           </div>
                                           <div className="flex items-center justify-between">
                                             <div className="flex items-center text-gray-500">
                                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                               </svg>
                                               <span>Duración:</span>
                                             </div>
                                             <span className="text-gray-700">{service.duracion}</span>
                                           </div>
                                         </div>
                                       </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Section */}
                <div className="md:w-2/3">
                    {/* Profile Form */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Personal</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} className="m-auto" />
                                </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.user.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                    />
                                </div>
                                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={profile.user.phone_number}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                    />
                                </div>
                                {formErrors.phone_number && <p className="mt-1 text-sm text-red-600">{formErrors.phone_number}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <FileText size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="dni"
                                            value={pendingChanges.dni || profile.user.dni}
                                            onChange={handleSensitiveChange}
                                            className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                        />
                                    </div>
                                    {formErrors.dni && <p className="mt-1 text-sm text-red-600">{formErrors.dni}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={profile.user.postal_code}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                        />
                                    </div>
                                    {formErrors.postal_code && <p className="mt-1 text-sm text-red-600">{formErrors.postal_code}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={pendingChanges.password || "******"}
                                        onChange={handleSensitiveChange}
                                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                    />
                                </div>
                                {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Biografía:</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio ? profile.bio : ""}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formErrors["bio"] && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors["bio"]}</p>
                                )}
                            </div>

                            {/* Confirmation Modal */}
                            {showConfirmation && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                                        <h2 className="text-lg font-bold mb-4">Confirmar Cambios</h2>
                                        <p className="text-sm text-gray-600 mb-6">
                                            Estás a punto de cambiar información sensible (DNI o contraseña). Si estás cambiando tu contraseña, ingresa tu contraseña actual.
                                        </p>
                                        {pendingChanges.password && (
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                                <input
                                                    type="password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                                />
                                                {formErrors.old_password && <p className="mt-1 text-sm text-red-600">{formErrors.old_password}</p>}
                                            </div>
                                        )}
                                        <div className="flex justify-end space-x-4">
                                            <GradientButton variant="grey" onClick={cancelSensitiveChanges}>
                                                Cancelar
                                            </GradientButton>
                                            <GradientButton variant="danger" onClick={confirmSensitiveChanges}>
                                                Confirmar
                                            </GradientButton>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <GradientButton variant="edit" className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center">
                                <Save size={18} className="mr-2" />
                                Actualizar Perfil
                            </GradientButton>
                        </form>
                    </div>
                    
                    {/* Calendar Schedule */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Calendario de disponibilidad</h3>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <ScheduleCalendar 
                                initialSchedule={schedule} 
                                onScheduleChange={handleScheduleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal for adding services */}
            {showServiceModal && (
                <ServiceModal
                    onClose={() => setShowServiceModal(false)}
                    onSave={handleAddService}
                />
            )}

            {/* Modals */}
            {showServiceModal && (
                <ServiceModal
                    onClose={() => setShowServiceModal(false)}
                    onSave={handleAddService}
                />
            )}
            
            {/* Add the ServiceEditModal here */}
            {showEditServiceModal && selectedService && (
                <ServiceEditModal
                    service={selectedService}
                    serviceName={selectedServiceName}
                    onClose={() => setShowEditServiceModal(false)}
                    onSave={handleUpdateService}
                    onDelete={handleDeleteService}
                />
            )}
        </div>
    );
};

export default FisioProfile;