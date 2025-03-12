"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./photo.scss";

const getAuthToken = () => {
    return localStorage.getItem("token"); // Obtiene el token JWT
};

const FisioProfile = () => {
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

    useEffect(() => {
        fetchFisioProfile();

        return () => {
            // Limpiar URLs de objeto cuando el componente se desmonte
            if (profile.user.photo && profile.user.photo.startsWith('blob:')) {
                URL.revokeObjectURL(profile.user.photo);
            }
        };
    }, []);

    const fetchFisioProfile = async () => {
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
                autonomic_community: response.data.physio.autonomic_community,
                bio: response.data.physio.bio,
                birth_date: response.data.physio.birth_date,
                collegiate_number: response.data.physio.collegiate_number,
                gender: response.data.physio.gender,
                rating_avg: response.data.physio.rating_avg,
                schedule: response.data.physio.schedule,
                services: response.data.physio.services
            });
            console.log(response.data);
        } catch (error: any) {
            setError("Error obteniendo el perfil.");
        } finally {
            setLoading(false); // ⬅️ Se ejecutará siempre, evitando que se quede en "Cargando..."
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "bio") {
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

            const formData = new FormData();

            // Agregar los campos del usuario
            Object.entries(profile.user).forEach(([key, value]) => {
                if (key !== 'photo' && key !== 'photoFile' && value)
                    formData.append(`user.${key}`, value);
            });

            // Agregar la foto si existe
            if (profile.user.photoFile) {
                formData.append('user.photo', profile.user.photoFile);
            }

            // Agregar los campos del paciente
            formData.append("gender", profile.gender);
            formData.append("birth_date", profile.birth_date);
            formData.append("autonomic_community", profile.autonomic_community);
            formData.append("collegiate_number", profile.collegiate_number);
            formData.append("bio", profile.bio);
            formData.append("rating_avg", profile.rating_avg);
            formData.append("schedule", profile.schedule);
            formData.append("services", profile.services);

            const response = await axios.post("http://localhost:8000/api/app_user/physio/update/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("Perfil actualizado correctamente");
                fetchFisioProfile(); // Recargar datos
            }
        } catch (error) {
            setError("Error actualizando el perfil.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Crear URL para vista previa
            const previewUrl = URL.createObjectURL(file);
            console.log(previewUrl);
            console.log(file);

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
            return `http://localhost:8000/api/app_user${profile.user.photo}`;
        }
        
        // Si no hay foto, usar la imagen por defecto
        return "/default_avatar.png";
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

export default FisioProfile;