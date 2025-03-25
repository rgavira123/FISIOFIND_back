"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const getAuthToken = () => {
  return localStorage.getItem("token"); // Obtiene el token JWT
};

const UploadVideo = ({ token }) => {
  const [file, setFileKey] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [patients, setPatients] = useState(""); // IDs de pacientes en formato de texto
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  useEffect(() => {
    const fetchPhysioVideos = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        console.error("❌ No hay token disponible.");
        setMessage("Error: No hay token de autenticación.");
        return;
      }

      setLoadingVideos(true);
      setMessage("");

      try {
        const response = await axios.get(`${getApiBaseUrl()}/api/app_user/videos/list-my-videos/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setVideos(response.data);
        } else {
          setMessage("❌ No se encontraron videos.");
        }
      } catch (error) {
        console.error("⚠️ Error al obtener los videos:", error);
        setMessage("❌ Error al obtener los videos.");
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchPhysioVideos();
  }, []);

  const handleFileChange = (event) => {
    setFileKey(event.target.files[0]);
  };

  const handlePatientsChange = (event) => {
    setPatients(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Por favor selecciona un archivo.");
      return;
    }

    const storedToken = getAuthToken();
    if (!storedToken) {
      console.error("❌ No hay token disponible.");
      setMessage("Error: No hay token de autenticación.");
      return;
    }

    const patientIds = patients
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (patientIds.length === 0) {
      setMessage("❌ Debes ingresar al menos un ID de paciente válido.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("patients", JSON.stringify(patientIds));

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${getApiBaseUrl()}/api/app_user/videos/upload/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      setMessage("✅ Video subido correctamente.");
      console.log("🎥 Respuesta del backend:", response.data);
    } catch (error) {
      setMessage("❌ Error al subir el video.");
      console.error("⚠️ Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      console.error("❌ No hay token disponible.");
      setMessage("Error: No hay token de autenticación.");
      return;
    }

    setMessage("");

    try {
      await axios.delete(`${getApiBaseUrl()}/api/app_user/videos/delete/${videoId}/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setMessage("✅ Video eliminado correctamente.");
      setVideos(videos.filter((video) => video.id !== videoId));
    } catch (error) {
      setMessage("❌ Error al eliminar el video.");
      console.error("⚠️ Error al eliminar el video:", error);
    }
  };

const [editingVideo, setEditingVideo] = useState(null);
const [editTitle, setEditTitle] = useState("");
const [editDescription, setEditDescription] = useState("");
const [editPatients, setEditPatients] = useState("");

const handleEdit = (video) => {
  setEditingVideo(video.id);
  setEditTitle(video.title);
  setEditDescription(video.description);
  setEditPatients(video.patients ? video.patients.join(", ") : "");
};

const handleUpdate = async (videoId) => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      setMessage("Error: No hay token de autenticación.");
      return;
    }
  
    // Convertir la lista de IDs de pacientes correctamente
    const patientIds = editPatients
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id)); // Filtrar valores inválidos
  
    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/app_user/videos/update-video/${videoId}/`,
        {
          title: editTitle,
          description: editDescription,
          patients: patientIds, // Enviar como lista, no como string
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setMessage("✅ Video actualizado correctamente.");
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? { ...video, title: editTitle, description: editDescription, patients: patientIds }
            : video
        )
      );
      setEditingVideo(null);
    } catch (error) {
      setMessage("❌ Error al actualizar el video.");
      console.error("⚠️ Error al actualizar el video:", error.response?.data || error);
    }
  };
  


  return (
    <div>
      <h2>Subir Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="IDs de pacientes (separados por comas)"
        value={patients}
        onChange={handlePatientsChange}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Subiendo..." : "Subir Video"}
      </button>
      {message && <p>{message}</p>}

      <h2>Mis Videos Subidos</h2>
      {loadingVideos ? <p>🔄 Cargando videos...</p> : null}
      {videos.length === 0 ? (
        <p>No has subido videos aún.</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <button onClick={() => handleDelete(video.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}

<ul>
    {videos.map((video) => (
      <li key={video.id}>
        {editingVideo === video.id ? (
          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="IDs de pacientes (separados por comas)"
              value={editPatients}
              onChange={(e) => setEditPatients(e.target.value)}
            />
            <button onClick={() => handleUpdate(video.id)}>Actualizar</button>
            <button onClick={() => setEditingVideo(null)}>Cancelar</button>
          </div>
        ) : (
          <div>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <button onClick={() => handleEdit(video)}>Editar</button>
          </div>
        )}
      </li>
    ))}
  </ul>
    </div>
  );
};

export default UploadVideo;