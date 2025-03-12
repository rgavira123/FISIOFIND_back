"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./photo.scss";

const getAuthToken = () => {
    return localStorage.getItem("token"); // Obtiene el token JWT
};

const PatientProfile = () => {
    // Inicializa el estado de la forma adecuada
    const [profile, setProfile] = useState({
        user: {
            dni: "",
            email: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            photo: "", // Si la foto está disponible en la respuesta
            postal_code: "",
            user_id: "",
            username: "",
        },
        authonomic_community: "",
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
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
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

            const response = await axios.get("http://localhost:8000/api/app_user/current-user/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Actualiza el perfil con la estructura correcta
            setProfile({
                user: {
                    dni: response.data.physio.user_data.dni,
                    email: response.data.physio.user_data.email,
                    first_name: response.data.physio.user_data.first_name,
                    last_name: response.data.physio.user_data.last_name,
                    phone_number: response.data.physio.user_data.phone_number,
                    photo: response.data.physio.user_data.photo, // Si la foto está disponible en la respuesta
                    postal_code: response.data.physio.user_data.postal_code,
                    user_id: response.data.physio.user_data.user_id,
                    username: response.data.physio.user_data.username,
                },
                authonomic_community: response.data.physio.authonomic_community,
                bio: response.data.physio.bio,
                birth_date: response.data.physio.birth_date,
                collegiate_number: response.data.physio.collegiate_number,
                gender: response.data.physio.gender,
                rating_avg: response.data.physio.rating_avg,
                schedule: response.data.physio.schedule,
                services: response.data.physio.services
            });
            console.log(response.data); // Debug
        } catch (error: any) {
            setError("Error obteniendo el perfil.");
        } finally {
            setLoading(false); // ⬅️ Se ejecutará siempre, evitando que se quede en "Cargando..."
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "bio"){
            setProfile((prevProfile) => ({
                ...prevProfile,
                bio: value,
            }));
        } else {
            // Actualiza el estado correctamente, asegurándose de que los campos `user` se mantengan dentro de su objeto
            setProfile((prevProfile) => ({
                ...prevProfile,
                user: {
                    ...prevProfile.user,
                    [name]: value,
                },
            }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getAuthToken();
            if (!token) {
                setError("No hay token disponible.");
                return;
            }

            if (selectedFile && typeof selectedFile === "object") profile.user.photo = selectedFile;

            console.log("Datos enviados al backend:", JSON.stringify(profile)); // Debug

            const response = await axios.post("http://localhost:8000/api/app_user/physio/update/", profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log(response)

            if (response.status === 200) {
                alert("Perfil actualizado correctamente");
                fetchPatientProfile(); // Recargar datos
            }
        } catch (error) {
            setError("Error actualizando el perfil.");
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        console.log(e.target.files[0]);
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
                    <img src={profile?.user?.photo || "/default_avatar.png"} id="output" width="200" />
                </div>
                <div className="user-info">
                    <p>{profile?.user?.username || "Nombre de usuario"}</p>
                    <p>{profile?.user?.first_name + " " + profile?.user?.last_name || "Nombre"}</p>
                    <p>DNI: {profile?.user?.dni || "No disponible"}</p>
                    <p>Número de colegiado: {profile?.collegiate_number || "No disponible"}</p>
                </div>
            </div>

            {/* Sección derecha con el formulario */}
            <div className="user-profile-right">
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={profile?.user?.email || ""}
                        onChange={handleChange}
                    />

                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={profile?.user?.phone_number || ""}
                        onChange={handleChange}
                    />

                    <label>Código Postal:</label>
                    <input
                        type="text"
                        name="postal_code"
                        value={profile?.user?.postal_code || ""}
                        onChange={handleChange}
                    />

                    <label>Fecha de Nacimiento:</label>
                    <input
                        type="date"
                        name="birth_date"
                        value={profile?.birth_date || ""}
                        disabled={true}
                    />

                    <label>Biografía:</label>
                    <input
                        type="text"
                        name="bio"
                        value={profile?.bio || ""}
                        onChange={handleChange}
                    />

                    <button type="submit">Actualizar Perfil</button>
                </form>
            </div>
        </div>

    );
};

export default PatientProfile;