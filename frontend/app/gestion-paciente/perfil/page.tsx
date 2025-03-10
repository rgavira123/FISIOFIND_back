"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000"; 

const getAuthToken = () => localStorage.getItem("token"); 

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    user: {
      username: "",
      email: "",
      phone_number: "",
      postal_code: "",
      dni: "",
      photo: "",
      account_status: "",
    },
    gender: "",
    birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); 
  const [success, setSuccess] = useState("");  
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    setLoading(true);
    setErrors({});
    setSuccess("");
    try {
      const token = getAuthToken();
      if (!token) {
        setErrors({ general: "No hay token disponible." });
        setLoading(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/app_user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(response.data || { user: {} }); 
    } catch (error) {
      setErrors({ general: "Error obteniendo el perfil." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prevProfile) => {
      if (name === "gender" || name === "birth_date") {
        return { ...prevProfile, [name]: value };
      }
      return {
        ...prevProfile,
        user: {
          ...prevProfile.user,
          [name]: value,
        },
      };
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageClick = () => {
    document.getElementById('file-input').click();  // Abrir el input oculto para cargar una nueva foto
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const birthDate = new Date(profile.birth_date);

    if (!profile.user.username) newErrors.username = "El nombre de usuario es obligatorio";
    if (!profile.user.phone_number) newErrors.phone_number = "El teléfono es obligatorio";
    if (!profile.user.dni) newErrors.dni = "El DNI es obligatorio";
    if (!profile.user.email) newErrors.email = "El email es obligatorio";
    if (!profile.user.postal_code) newErrors.postal_code = "El código postal es obligatorio";
    if (!profile.gender) newErrors.gender = "El género es obligatorio";
    if (!profile.birth_date) newErrors.birth_date = "La fecha de nacimiento es obligatoria";

    if (profile.user.phone_number && profile.user.phone_number.length !== 9) {
      newErrors.phone_number = "El teléfono debe tener 9 dígitos";
    }

    if (profile.user.postal_code && profile.user.postal_code.length !== 5) {
      newErrors.postal_code = "El código postal debe tener 5 dígitos";
    }

    if (profile.birth_date && birthDate >= today) {
      newErrors.birth_date = "La fecha de nacimiento debe ser anterior a la fecha actual";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});  

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;  
    }

    try {
        const token = getAuthToken();
        if (!token) {
            setErrors({ general: "No hay token disponible." });
            return;
        }

        const formData = new FormData();

        // Agregar los campos del usuario
        Object.entries(profile.user).forEach(([key, value]) => {
            if (value) formData.append(`user.${key}`, value);
        });

        // Agregar los campos del paciente
        formData.append("gender", profile.gender);
        formData.append("birth_date", profile.birth_date);

        // Agregar la foto si hay una seleccionada
        if (selectedFile && typeof selectedFile === "object"){
            formData.append("user.photo", selectedFile);
        } else {
            formData.append("user.photo", profile.user.photo)
        }

        const response = await axios.patch(`${BASE_URL}/api/app_user/profile/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            setSuccess("Perfil actualizado correctamente");
            fetchPatientProfile(); // Recargar perfil automáticamente
        }
    } catch (error) {
        if (error.response && error.response.data) {
            const data = error.response.data;
            let errorMessages = {};

            if (data.user) {
                if (data.user.phone_number) {
                    errorMessages.phone_number = data.user.phone_number[0];
                }
                if (data.user.photo) {
                    errorMessages.photo = data.user.photo[0]; 
                }
                if (data.user.username) {
                    errorMessages.username = data.user.username[0];
                }
                if (data.user.email) {
                    errorMessages.email = data.user.email[0]; 
                }
                if (data.user.dni) {
                    errorMessages.dni = data.user.dni[0]; 
                }
            }

            setErrors(errorMessages);
        } else {
            setErrors({ general: "Error al actualizar el perfil." });
        }
    }
};

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f3f3]">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#253240]">Perfil del Paciente</h2>
        {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-center mb-4">
            {success}
        </div>
        )}

        {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-4" onClick={handleImageClick}>
            <img 
              src={profile.user.photo ? `${BASE_URL}${profile.user.photo}` : `${BASE_URL}/media/default.png`}
              alt="Foto de perfil"
              className="rounded-full border-4 border-[#05668D] shadow-md"
              width={150}
              height={150}
            />
            <input 
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-[#253240]">Nombre de usuario:</label>
            <input
              type="text"
              name="username"
              value={profile?.user?.username || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}

            <label className="font-semibold text-[#253240]">Email:</label>
            <input
              type="email"
              name="email"
              value={profile?.user?.email || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <label className="font-semibold text-[#253240]">Teléfono:</label>
            <input
              type="text"
              name="phone_number"
              value={profile?.user?.phone_number || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}

            <label className="font-semibold text-[#253240]">Código Postal:</label>
            <input
              type="text"
              name="postal_code"
              value={profile?.user?.postal_code || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.postal_code && <p className="text-red-500">{errors.postal_code}</p>}

            <label className="font-semibold text-[#253240]">DNI:</label>
            <input
              type="text"
              name="dni"
              value={profile?.user?.dni || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.dni && <p className="text-red-500">{errors.dni}</p>}

            <label className="font-semibold text-[#253240]">Género:</label>
            <select
              name="gender"
              value={profile?.gender || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            >
              <option value="">Selecciona una opción</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}

            <label className="font-semibold text-[#253240]">Fecha de Nacimiento:</label>
            <input
              type="date"
              name="birth_date"
              value={profile?.birth_date || ""}
              onChange={handleChange}
              className="w-full p-3 border border-[#05668D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#41b8d5] text-gray-700"
            />
            {errors.birth_date && <p className="text-red-500">{errors.birth_date}</p>}
          <button
              type="submit"
              className="w-full bg-[#05668D] text-white py-3 rounded-md hover:bg-[#41b8d5] transition"
            >
              Actualizar Perfil
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
