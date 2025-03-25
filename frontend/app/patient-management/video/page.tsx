"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const getAuthToken = () => {
  return localStorage.getItem("token"); // Obtiene el token JWT
};

const PatientVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Cargando inicialmente
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false); // Para controlar el modal de carga del video

  useEffect(() => {
    const fetchVideos = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        console.error("❌ No hay token disponible.");
        setMessage("Error: No hay token de autenticación.");
        setLoading(false);
        return;
      }

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
        setLoading(false); // Al finalizar la carga de videos, cambia el estado
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = async (videoId) => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      console.error("❌ No hay token disponible.");
      setMessage("Error: No hay token de autenticación.");
      return;
    }

    setIsVideoLoading(true); // Mostrar el modal de "Cargando video"

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/app_user/videos/stream-video/${videoId}/`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        responseType: 'blob', // Necesario para manejar el video como un archivo binario
      });

      const videoUrl = URL.createObjectURL(response.data); // Crear una URL temporal para el archivo blob
      setVideoUrl(videoUrl); // Establecer la URL del video

    } catch (error) {
      console.error("⚠️ Error al obtener el video:", error);
      setMessage("❌ Error al obtener el video.");
    } finally {
      setIsVideoLoading(false); // Ocultar el modal de "Cargando video" cuando el video esté listo
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Lista de Videos</h2>

      {/* Mostrar "Cargando videos..." mientras se está cargando */}
      {loading && <p className="text-center text-gray-600">🔄 Cargando videos...</p>}

      {/* Mostrar mensaje de error si hay algún problema al cargar los videos */}
      {message && <p className="text-center text-red-600">{message}</p>}

      <div className="mt-6">
        {/* Si no hay videos y no se está cargando, muestra el mensaje de "No tienes videos disponibles" */}
        {videos.length === 0 && !loading && (
          <p className="text-center text-gray-600">No tienes videos disponibles.</p>
        )}

        {/* Si hay videos, muéstralos */}
        {videos.length > 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="p-4 bg-white rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{video.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{video.description}</p>
                <button
                  onClick={() => handleVideoClick(video.id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Ver Video
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isVideoLoading && (
        <div className="modal">
          <div className="modal-content">
            <p>Estamos cargando tu video, espera un momentito...</p>
            <img
              width={1000}
              height={700}
              src="https://i.pinimg.com/originals/f0/ea/b2/f0eab24676401bdbcd892f2b5b7ede43.gif"
              alt="Cargando"
              className="loading-gif"
            />
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-4xl w-full relative">
            <button
              onClick={() => setVideoUrl(null)}  // Cierra el video al hacer clic en la "X"
              className="absolute top-0 right-0 p-2 text-black bg-transparent border-none hover:text-gray-600 transition"
            >
              ❌
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Reproduciendo Video</h3>
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                controls
              >
                <source src={videoUrl} type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
              </video>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          color: black;
        }

        .loading-gif {
          margin-top: 20px;
          width: 1000px;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default PatientVideos;
