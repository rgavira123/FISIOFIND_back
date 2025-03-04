'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Room.module.css';

// Subcomponentes
import RoomHeader from './RoomHeader';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import ChatPanel from './ChatPanel';
import SettingsPanel from './SettingsPanel';
import ToolsContainer from './ToolsContainer';
import ToolPanel from './ToolPanel';

/**
 * Componente principal de la Sala de videollamada
 * @param {string} roomCode  - ID/código de la sala
 * @param {string} userRole  - 'physio' o 'patient' para controlar la UI
 */
const Room = ({ roomCode}) => {
    const searchParams = useSearchParams();
    const userRole = searchParams.get('role') || 'physio';
  // TODO: Cuando se integre el backend, userRole podría venir desde el login o desde el contexto global

  // Estados de WebSocket / WebRTC
  const [ws, setWs] = useState(null);
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);

  // Estados para controles de UI
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Estados para chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sistema', text: 'Bienvenido a la consulta virtual. El chat está disponible para comunicación durante la sesión.' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Estados para herramienta Plantillas -> Mapas de dolor
  const [activePainMap, setActivePainMap] = useState(null);

  // Referencias de video
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Referencias para autoscroll del chat
  const chatMessagesRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    // Conectar al WebSocket
    const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomCode}/`);
    socket.onopen = () => {
      console.log('Conectado al WebSocket');
      setConnecting(false);
    };

    socket.onerror = () => {
      setErrorMessage('Error de conexión con el servidor');
      setConnecting(false);
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.action === 'new-offer') {
        setOffer(data.message);
        await handleOffer(data.message);
      } else if (data.action === 'new-answer') {
        setAnswer(data.message);
        await handleAnswer(data.message);
        setConnected(true);
      } else if (data.action === 'chat-message') {
        addChatMessage('Paciente', data.message);
      }
    };

    setWs(socket);

    // Obtener el stream local (cámara y micrófono)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.log("Error al acceder a cámara/micrófono: ", err);
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Permiso denegado para cámara o micrófono. Por favor, habilita los permisos en tu navegador.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('No se encontró cámara o micrófono. Verifica la conexión de tus dispositivos.');
        } else {
          setErrorMessage(`Error: ${err.message}`);
        }
        setCameraActive(false);
        setMicActive(false);
      });

    // Cleanup al desmontar
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (socket) {
        socket.close();
      }
    };
  }, [roomCode]);

  useEffect(() => {
    // Autoscroll al final del chat
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Manejo de oferta (Offer)
  const handleOffer = async (remoteOffer) => {
    const peer = new RTCPeerConnection();
    setPeerConnection(peer);

    // Agregar stream local
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
      });
    }

    // Setear la oferta recibida
    await peer.setRemoteDescription(new RTCSessionDescription(remoteOffer.sdp));

    // Crear y setear la respuesta (Answer)
    const localAnswer = await peer.createAnswer();
    await peer.setLocalDescription(localAnswer);

    // Enviar la respuesta al servidor
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        action: 'new-answer',
        message: { sdp: localAnswer }
      }));
    }

    // Manejo de ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          action: 'new-candidate',
          message: { candidate: event.candidate }
        }));
      }
    };

    // Al recibir el stream remoto
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnected(true);
        addChatMessage('Sistema', 'Paciente conectado a la videollamada.');
      }
    };
  };

  // Manejo de respuesta (Answer)
  const handleAnswer = async (remoteAnswer) => {
    if (peerConnection) {
      const desc = new RTCSessionDescription(remoteAnswer.sdp);
      await peerConnection.setRemoteDescription(desc);
      setConnected(true);
    }
  };

  // Crear y enviar oferta
  const sendOffer = async () => {
    setConnecting(true);
    const peer = new RTCPeerConnection();

    // Agregar el stream local
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peer.addTrack(track, localStream);
      });
    }

    // Crear oferta
    const localOffer = await peer.createOffer();
    await peer.setLocalDescription(localOffer);

    // Enviar oferta por WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        action: 'new-offer',
        message: { sdp: localOffer }
      }));
    } else {
      setErrorMessage('Error: No hay conexión con el servidor');
      setConnecting(false);
      return;
    }

    // Manejo de ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          action: 'new-candidate',
          message: { candidate: event.candidate }
        }));
      }
    };

    // Al recibir el stream remoto
    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnected(true);
        setConnecting(false);
        addChatMessage('Sistema', 'Paciente conectado a la videollamada.');
      }
    };

    setPeerConnection(peer);

    // Timeout de 10s si no hay respuesta
    setTimeout(() => {
      if (!connected) {
        setConnecting(false);
        setErrorMessage('No se pudo establecer la conexión. Inténtalo de nuevo.');
      }
    }, 10000);
  };

  // Toggle micrófono
  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micActive;
        setMicActive(!micActive);
        addChatMessage('Sistema', `Micrófono ${!micActive ? 'activado' : 'desactivado'}`);
      }
    }
  };

  // Toggle cámara
  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraActive;
        setCameraActive(!cameraActive);
        addChatMessage('Sistema', `Cámara ${!cameraActive ? 'activada' : 'desactivada'}`);
      }
    }
  };

  // Compartir pantalla
  const toggleScreenShare = () => {
    if (isSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (peerConnection) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const senders = peerConnection.getSenders();
        const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
        if (videoSender) {
          await videoSender.replaceTrack(videoTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        videoTrack.onended = () => {
          stopScreenShare();
        };
        setIsSharing(true);
        addChatMessage('Sistema', 'Has comenzado a compartir tu pantalla');
      }
    } catch (error) {
      console.error('Error al compartir pantalla:', error);
      addChatMessage('Sistema', `Error al compartir pantalla: ${error.message}`);
    }
  };

  const stopScreenShare = async () => {
    try {
      if (peerConnection && localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        const senders = peerConnection.getSenders();
        const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
        if (videoSender && videoTrack) {
          await videoSender.replaceTrack(videoTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
        setIsSharing(false);
        addChatMessage('Sistema', 'Has dejado de compartir tu pantalla');
      }
    } catch (error) {
      console.error('Error al detener la compartición de pantalla:', error);
    }
  };

  // Finalizar llamada
  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
    addChatMessage('Sistema', 'Has finalizado la llamada');
    setConnected(false);
    setLocalStream(null);
    // TODO: aquí podrías redireccionar o mostrar otra vista final
  };

  // Manejo de mensajes de chat
  const addChatMessage = (sender, text) => {
    setChatMessages(prev => [...prev, { sender, text }]);
  };

  const sendChatMessage = () => {
    if (messageInput.trim() === '') return;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        action: 'chat-message',
        message: messageInput
      }));
    }
    addChatMessage('Fisioterapeuta', messageInput);
    setMessageInput('');
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };

  // Manejo de selección de mapa de dolor
  const handlePainMapSelect = (mapId) => {
    setActivePainMap(mapId);
  };

  const sendPainMapToPatient = () => {
    if (activePainMap) {
      addChatMessage('Sistema', `Mapa de dolor "${activePainMap}" enviado al paciente.`);
    }
  };

  // El fisioterapeuta sí ve las herramientas; el paciente no.
  const showTools = (userRole === 'physio');

  return (
    <div className={styles.roomContainer}>
      {/* Header con título y errorMessage */}
      <RoomHeader 
        roomCode={roomCode} 
        errorMessage={errorMessage}
      />

      {/* Grilla de videos */}
      <VideoGrid 
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        cameraActive={cameraActive}
        connected={connected}
        isSharing={isSharing}
        userRole={userRole}
      />

      {/* Controles de la videollamada */}
      <Controls 
        micActive={micActive}
        cameraActive={cameraActive}
        toggleMic={toggleMic}
        toggleCamera={toggleCamera}
        toggleScreenShare={toggleScreenShare}
        showChat={showChat}
        setShowChat={setShowChat}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        endCall={endCall}
      />

      {/* Panel de chat */}
      <ChatPanel 
        showChat={showChat}
        chatMessages={chatMessages}
        chatMessagesRef={chatMessagesRef}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleKeyPress={handleKeyPress}
        sendChatMessage={sendChatMessage}
        messageInputRef={messageInputRef}
      />

      {/* Panel de configuraciones */}
      <SettingsPanel
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Herramientas, solo si es fisioterapeuta */}
      {showTools && (
        <>
          <ToolsContainer 
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            toggleScreenShare={toggleScreenShare} 
          />
          {selectedTool && (
            <ToolPanel 
              selectedTool={selectedTool}
              activePainMap={activePainMap}
              handlePainMapSelect={handlePainMapSelect}
              sendPainMapToPatient={sendPainMapToPatient}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Room;
