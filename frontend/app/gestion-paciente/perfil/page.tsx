"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const getAuthToken = () => {
  return localStorage.getItem("token"); // Obtiene el token JWT
};

const PatientProfile = () => {
  // Inicializa el estado de la forma adecuada
  const [profile, setProfile] = useState({
    user: {
      username: "",
      email: "",
      phone_number: "",
      postal_code: "",
    },
    gender: "",
    birth_date: "",
    photo: null, // Agregar el estado para la foto
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Token guardado en localStorage", getAuthToken());
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError("No hay token disponible.");
        setLoading(false); // ⬅️ Asegurar que loading se detiene
        return;
      }

      const response = await axios.get("http://localhost:8000/api/app_user/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualiza el perfil con la estructura correcta
      setProfile({
        user: response.data.user, // La respuesta debe tener el campo `user`
        gender: response.data.gender,
        birth_date: response.data.birth_date,
        photo: response.data.photo, // Si la foto está disponible en la respuesta
      });
    } catch (error) {
      setError("Error obteniendo el perfil.");
    } finally {
      setLoading(false); // ⬅️ Se ejecutará siempre, evitando que se quede en "Cargando..."
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Actualiza el estado correctamente, asegurándose de que los campos `user` se mantengan dentro de su objeto
    setProfile((prevProfile) => ({
      ...prevProfile,
      user: {
        ...prevProfile.user,
        [name]: value,
      },
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const token = getAuthToken();
        if (!token) {
            setError("No hay token disponible.");
            return;
        }

        const updatedData = {
            user: {
                username: profile.user.username,
                email: profile.user.email,
                phone_number: profile.user.phone_number,
                postal_code: profile.user.postal_code,
            },
            gender: profile.gender,
            birth_date: profile.birth_date,
        };

        console.log("Datos enviados al backend:", JSON.stringify(updatedData)); // Debug

        const response = await axios.patch("http://localhost:8000/api/app_user/profile/", updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            alert("Perfil actualizado correctamente");
            fetchPatientProfile(); // Recargar datos
        }
    } catch (error) {
        setError("Error actualizando el perfil.");
    }
};




  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Perfil del Paciente</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre de Usuario:</label>
        <input
          type="text"
          name="username"
          value={profile.user.username}  // Accede a `user.username`
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={profile.user.email}  // Accede a `user.email`
          onChange={handleChange}
        />

        <label>Teléfono:</label>
        <input
          type="text"
          name="phone_number"
          value={profile.user.phone_number}  // Accede a `user.phone_number`
          onChange={handleChange}
        />

        <label>Código Postal:</label>
        <input
          type="text"
          name="postal_code"
          value={profile.user.postal_code}  // Accede a `user.postal_code`
          onChange={handleChange}
        />

        <label>Género:</label>
        <input
          type="text"
          name="gender"
          value={profile.gender}  // Accede a `gender`
          onChange={handleChange}
        />

        <label>Fecha de Nacimiento:</label>
        <input
          type="date"
          name="birth_date"
          value={profile.birth_date}  // Accede a `birth_date`
          onChange={handleChange}
        />



        <button type="submit">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default PatientProfile;
