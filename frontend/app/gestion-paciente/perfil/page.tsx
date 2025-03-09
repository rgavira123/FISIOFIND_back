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
    setErrors({});  // Resetear errores cada vez que se hace una nueva petición
    setSuccess("");  // Resetear mensaje de éxito
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
        if (selectedFile && typeof selectedFile === "object") formData.append("user.photo", selectedFile);

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
            // Otros errores generales
            if (!errorMessages.phone_number && !errorMessages.photo) {
                errorMessages.general = data.detail || "Error al actualizar el perfil.";
            }

            setErrors(errorMessages);
        } else {
            setErrors({ general: "Error al actualizar el perfil." });
        }
    }
};

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Perfil del Paciente</h2>
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      {success && <p style={{ color: "green" }}>{success}</p>} 


      <form onSubmit={handleSubmit}>
        <label>Nombre de usuario:</label>
        <input 
          type="text" 
          name="username" 
          value={profile?.user?.username || ""} 
          onChange={handleChange} 
        />
        {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}

        <label>Email:</label>
        <input 
          type="email" 
          name="email" 
          value={profile?.user?.email || ""} 
          onChange={handleChange} 
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>} 

        <label>Teléfono:</label>
        <input 
          type="text" 
          name="phone_number" 
          value={profile?.user?.phone_number || ""} 
          onChange={handleChange} 
        />
        {errors.phone_number && <p style={{ color: "red" }}>{errors.phone_number}</p>} 

        <label>Código Postal:</label>
        <input 
          type="text" 
          name="postal_code" 
          value={profile?.user?.postal_code || ""} 
          onChange={handleChange} 
        />
        {errors.postal_code && <p style={{ color: "red" }}>{errors.postal_code}</p>}

        <label>DNI:</label>
        <input 
          type="text" 
          name="dni" 
          value={profile?.user?.dni || ""} 
          onChange={handleChange} 
        />
        {errors.dni && <p style={{ color: "red" }}>{errors.dni}</p>} 
        
        <label>Género:</label>
        <select 
          name="gender" 
          value={profile?.gender || ""} 
          onChange={handleChange}
        >
          <option value="">Selecciona una opción</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
        {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}

        <label>Fecha de Nacimiento:</label>
        <input 
          type="date" 
          name="birth_date" 
          value={profile?.birth_date || ""} 
          onChange={handleChange} 
        />
        {errors.birth_date && <p style={{ color: "red" }}>{errors.birth_date}</p>} 

        <button type="submit">Actualizar Perfil</button>
        <button type="button" onClick={fetchPatientProfile}>Cancelar</button>
      </form>
    </div>
  );
};

export default PatientProfile;
