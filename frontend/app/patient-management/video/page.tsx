"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

const getAuthToken = () => {
  return localStorage.getItem("token"); // Obtiene el token JWT
};

const PatientVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false); // Para controlar el modal de carga del video

  useEffect(() => {
    const fetchVideos = async () => {
      const storedToken = getAuthToken();
      if (!storedToken) {
        console.error("❌ No hay token disponible.");
        setMessage("Error: No hay token de autenticación.");
        return;
      }

      setLoading(true);
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
        setLoading(false);
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
    <div align="center">
      <h2>Mis Videos</h2>
      {loading && <p>🔄 Cargando videos...</p>}
      {message && <p>{message}</p>}

      <div>
        {videos.length === 0 ? (
          <p>No tienes videos disponibles.</p>
        ) : (
          <ul>
            {videos.map((video) => (
              <li key={video.id}>
                <div>
                  <h3>Título: {video.title}</h3>
                  <p>Descripción: {video.description}</p>
                  <button onClick={() => handleVideoClick(video.id)}>Ver Video</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isVideoLoading && (
        <div className="modal">
          <div className="modal-content">
            <p>Estamos cargando tu video, espera un momentito...</p>
            <img
              width={1000} // Ajusta el tamaño del gif
              height={700}
              src="https://i.pinimg.com/originals/f0/ea/b2/f0eab24676401bdbcd892f2b5b7ede43.gif"
              alt="Cargando"
              className="loading-gif"
            />
          </div>
        </div>
      )}

      {videoUrl && (
        <div>
          <h3>Reproduciendo Video</h3>
          <video width="640" height="480" controls>
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
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
          color: white;
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
          width: 1000px; // Ajusta el tamaño del gif
          height: auto; // Mantiene la relación de aspecto
        }
      `}</style>
    </div>
  );
};

export default PatientVideos;
