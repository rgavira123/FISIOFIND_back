"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";


const getAuthToken = () => {
  return localStorage.getItem("token");
};


const UploadVideo = ({ token }) => {
  const router = useRouter(); // Initialize router
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
    const checkAuthentication = () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        setMessage("Error: No hay token de autenticación.");
        router.push("/login"); // Redirect to login page
      }
    };

    checkAuthentication();
  }, [router]);

  useEffect(() => {
    const fetchPhysioVideos = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
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
        if (error.response?.status === 401) {
          setMessage("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
        } else {
          setMessage("❌ Error al obtener los videos.");
        }
        console.error("⚠️ Error al obtener los videos:", error);
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

    if (!title.trim()) {
      setMessage("❌ El título no puede estar vacío.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      return;
    }

    if (!description.trim()) {
      setMessage("❌ La descripción no puede estar vacía.");
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      return;
    }

    const storedToken = getAuthToken();
    if (!storedToken) {
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
    formData.append("patients", JSON.stringify(patientIds)); // Ensure JSON string

    // Debugging: Log formData keys and values
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

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
      if (error.response?.status === 401) {
        setMessage("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        const errorMessage =
          error.response?.data?.detail || // Specific error message from the backend
          error.response?.data || // General error data
          error.message || // Error message from the error object
          "Error desconocido al subir el video."; // Fallback message

        setMessage(`❌ ${errorMessage}`);
      }
      setTimeout(() => setMessage(""), 5000); // Mensaje volátil
      console.error("⚠️ Error al subir el video:", error);
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
      if (error.response?.status === 401) {
        setMessage("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        setMessage("❌ Error al eliminar el video.");
      }
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
          <EditVideoForm 
            editTitle={editTitle}
            editDescription={editDescription}
            editPatients={editPatients}
            setEditTitle={setEditTitle}
            setEditDescription={setEditDescription}
            setEditPatients={setEditPatients}
            handleUpdate={() => handleUpdate(editingVideo)}
          />
        ) : (
          <UploadVideoForm 
            title={title}
            description={description}
            patients={patients}
            loading={loading}
            setTitle={setTitle}
            setDescription={setDescription}
            handleFileChange={handleFileChange}
            handlePatientsChange={handlePatientsChange}
            handleUpload={handleUpload}
          />
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
          <p className="text-center text-gray-500">Cargando videos...</p>
        ) : (
          videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((video) => (
                <VideoItem 
                  key={video.id}
                  video={video}
                  onEdit={() => handleEdit(video)}
                  onDelete={() => handleDelete(video.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No tienes videos subidos aún.</p>
          )
        )}
      </div>

      {showModal && (
        <DeleteConfirmationModal 
          onCancel={handleCancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

const EditVideoForm = ({
  editTitle,
  editDescription,
  editPatients,
  setEditTitle,
  setEditDescription,
  setEditPatients,
  handleUpdate
}) => (
  <>
    <InputField 
      type="text"
      placeholder="Nuevo Título"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
    />
    <TextareaField 
      placeholder="Nueva Descripción"
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
    />
    <InputField 
      type="text"
      placeholder="IDs de pacientes (separados por coma)"
      value={editPatients}
      onChange={(e) => setEditPatients(e.target.value)}
    />
    <button
      onClick={handleUpdate}
      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
    >
      <Edit2 className="mr-2" size={20} />
      Actualizar Video
    </button>
  </>
);

const UploadVideoForm = ({
  title,
  description,
  patients,
  loading,
  setTitle,
  setDescription,
  handleFileChange,
  handlePatientsChange,
  handleUpload
}) => (
  <>
    <InputField 
      type="file"
      accept="video/*"
      onChange={handleFileChange}
    />
    <InputField 
      type="text"
      placeholder="Título del video"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
    <TextareaField 
      placeholder="Descripción del video"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
    <InputField 
      type="text"
      placeholder="IDs de pacientes (separados por coma)"
      value={patients}
      onChange={handlePatientsChange}
    />
    <button
      onClick={handleUpload}
      disabled={loading}
      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
    >
      <UploadCloud className="mr-2" size={20} />
      {loading ? "Subiendo..." : "Subir Video"}
    </button>
  </>
);

const VideoItem = ({ video, onEdit, onDelete }) => (
  <div className="bg-gray-100 p-4 rounded-md shadow-md flex justify-between items-center">
    <div>
      <h4 className="font-semibold text-gray-800">{video.title}</h4>
      <p className="text-gray-600">{video.description}</p>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition"
      >
        <Edit2 size={20} />
      </button>
      <button
        onClick={onDelete}
        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);

const DeleteConfirmationModal = ({ onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">¿Estás seguro?</h3>
      <div className="flex justify-between gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 flex-1"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

const InputField = ({ type, accept, placeholder, value, onChange }) => (
  <div>
    <input
      type={type}
      accept={accept}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const TextareaField = ({ placeholder, value, onChange }) => (
  <div>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-2 bg-gray-100 rounded-md border border-gray-300 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
      rows={3}
    />
  </div>
);

export default UploadVideo;
