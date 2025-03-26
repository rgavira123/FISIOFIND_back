"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { Loader2 } from 'lucide-react';


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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Lista de Videos</h2>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center text-gray-500">
          <Loader2 className="animate-spin mr-2" />
          <span>Cargando videos...</span>
        </div>
      )}
      
      {/* Error Message */}
      {message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center">
          <AlertCircle className="mr-2 text-red-500" />
          <span>{message}</span>
        </div>
      )}
      
      {/* No Videos Available */}
      {videos.length === 0 && !loading && (
        <div className="text-center text-gray-500 py-8">
          <p>No tienes videos disponibles.</p>
        </div>
      )}
      
      {/* Video List */}
      {videos.length > 0 && !loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white shadow-md rounded-lg overflow-hidden transition-all hover:shadow-xl"
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {video.description}
                </p>
                <button
                  onClick={() => handleVideoClick(video.id)}
                  className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Play className="mr-2" size={20} />
                  Ver Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Video Loading Modal */}
      {isVideoLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-700">
              Estamos cargando tu video, espera un momentito...
            </p>
          </div>
        </div>
      )}
      
      {/* Video Player */}
      {videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={() => setVideoUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
            >
              ❌ Cerrar
            </button>
            <video 
              controls 
              className="w-full rounded-lg"
              src={videoUrl}
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientVideos;
