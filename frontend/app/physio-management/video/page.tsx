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
  const [showModal, setShowModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

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
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      return;
    }

    const storedToken = getAuthToken();
    if (!storedToken) {
      console.error("❌ No hay token disponible.");
      setMessage("Error: No hay token de autenticación.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      return;
    }

    const patientIds = patients
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (patientIds.length === 0) {
      setMessage("❌ Debes ingresar al menos un ID de paciente válido.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
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
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      console.log("🎥 Respuesta del backend:", response.data);
    } catch (error) {
      setMessage("❌ Error al subir el video.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      console.error("⚠️ Error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    setVideoToDelete(videoId); // Guardamos el video para eliminarlo más tarde
    setShowModal(true); // Mostramos el modal
  };

  const confirmDelete = async () => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      console.error("❌ No hay token disponible.");
      setMessage("Error: No hay token de autenticación.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      return;
    }

    setMessage("");

    try {
      await axios.delete(`${getApiBaseUrl()}/api/app_user/videos/delete/${videoToDelete}/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setMessage("✅ Video eliminado correctamente.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      setVideos(videos.filter((video) => video.id !== videoToDelete));
      setShowModal(false); // Cerramos el modal
    } catch (error) {
      setMessage("❌ Error al eliminar el video.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      console.error("⚠️ Error al eliminar el video:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Cerramos el modal sin eliminar el video
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
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      return;
    }

    const patientIds = editPatients
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    try {
      const response = await axios.put(
        `${getApiBaseUrl()}/api/app_user/videos/update-video/${videoId}/`,
        {
          title: editTitle,
          description: editDescription,
          patients: patientIds,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Video actualizado correctamente.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
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
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      console.error("⚠️ Error al actualizar el video:", error.response?.data || error);
    }
  };

  return (
<div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        {editingVideo ? "Editar Video" : "Subir Video"}
      </h2>
      <div className="flex flex-col gap-4">
        {editingVideo ? (
          <>
            <div>
              <input
                type="text"
                placeholder="Nuevo Título"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <div>
              <textarea
                placeholder="Nueva Descripción"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="IDs de pacientes (separados por coma)"
                value={editPatients}
                onChange={(e) => setEditPatients(e.target.value)}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <button
              onClick={() => handleUpdate(editingVideo)}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
              Actualizar Video
            </button>
          </>
        ) : (
          <>
            <div>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Título del video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <div>
              <textarea
                placeholder="Descripción del video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="IDs de pacientes (separados por coma)"
                value={patients}
                onChange={handlePatientsChange}
                className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full"
              />
            </div>

            <button
              onClick={handleUpload}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Subiendo..." : "Subir Video"}
            </button>
          </>
        )}

        {message && (
          <div
            className={`mt-4 p-2 text-center ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mt-8">Mis Videos</h3>
      <div className="mt-4">
        {loadingVideos ? (
          <p>Cargando videos...</p>
        ) : (
          videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
                <h4 className="font-semibold text-gray-800">{video.title}</h4>
                <p>{video.description}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(video)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes videos subidos aún.</p>
          )
        )}
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">¿Estás seguro?</h3>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
