import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { getApiBaseUrl } from "@/utils/api";

const useRoomManagement = ({
  roomCode,
  userRole,
  closeConnection,
  cleanupMedia,
  sendWebSocketMessage,
  addChatMessage,
  onCallEndedMessage // ✅ Este callback detectará si el paciente recibe la notificación de cierre
}) => {
  // Estados para manejar el modal y la eliminación
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const endCall = useCallback(() => {
    addChatMessage('Sistema', 'Has finalizado la llamada');
  
    if (userRole === 'physio') {
      // Mostrar el modal antes de cerrar la conexión
      setModalMessage("¿Deseas eliminar la sala de la videollamada?");
      setShowDeleteButtons(true);
      setShowModal(true);
    } else {
      // Enviar mensaje WebSocket notificando que el paciente ha salido
      sendWebSocketMessage({
        action: 'user-left',
        message: { role: 'patient' }
      });
  
      // Redirigir al paciente después de un pequeño retraso
      setTimeout(() => {
        window.location.href = '/videollamadas';
      }, 1000);
    }
  }, [userRole, addChatMessage, sendWebSocketMessage]);
  

  const confirmDeleteRoom = useCallback(async () => {
    if (!isClient) return;
  
    try {
      const storedToken = localStorage.getItem('token'); // Obtiene el token pero no lo almacena
  
      // Notificar a todos los usuarios de que la llamada se ha finalizado
      await sendWebSocketMessage({
        action: 'call-ended',
        message: { text: 'La videollamada ha sido finalizada por el fisioterapeuta.' }
      });
  
      // Esperar un poco antes de proceder con la eliminación
      setTimeout(async () => {
        const response = await axios.delete(
          `${getApiBaseUrl()}/api/videocall/delete-room/${roomCode}/`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}` // Usa el token directamente aquí
            }
          }
        );
  
        if (response.status === 204) {
          console.log('Sala eliminada correctamente');
  
          // Notificar al usuario que la llamada ha finalizado
          setModalMessage("La llamada ha finalizado");
          setShowDeleteButtons(false);
          setShowModal(true);
  
          // Cerrar la conexión WebRTC y limpiar recursos
          closeConnection();
          cleanupMedia();
  
          // Redirigir después de un tiempo
          setTimeout(() => {
            window.location.href = '/videollamadas';
          }, 2000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error eliminando la sala:', error);
      setModalMessage("Error eliminando la sala, intenta nuevamente.");
    }
  }, [roomCode, sendWebSocketMessage, closeConnection, cleanupMedia, isClient]);
  

  const cancelDelete = useCallback(() => {
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (onCallEndedMessage) {
      closeConnection();
      cleanupMedia();
      window.location.href = '/videollamadas';
    }
  }, [onCallEndedMessage, closeConnection, cleanupMedia]);

  const handleCallEnded = useCallback(() => {
    setModalMessage("La reunión ha finalizado.");
    setShowModal(true);
  
    setTimeout(() => {
      closeConnection();
      cleanupMedia();
      window.location.href = '/videollamadas';
    }, 2000);
  }, [closeConnection, cleanupMedia]);
  

  return {
    showModal,
    modalMessage,
    showDeleteButtons,
    setShowModal,
    setModalMessage,
    setShowDeleteButtons,
    endCall,       
    confirmDeleteRoom,
    cancelDelete,
    handleCallEnded      
  };
};

export default useRoomManagement;