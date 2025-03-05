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
 * @param {string} roomCode - ID/código de la sala
 */
const Room = ({ roomCode }) => {
  const searchParams = useSearchParams();
  const userRole = searchParams.get('role') || 'physio';

  // ========== REFERENCIAS ==========
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const messageInputRef = useRef(null);
  const remoteUserChannelRef = useRef(null);

  // ========== ESTADOS ==========
  // WebRTC y conexión
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Controles de medios
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  // UI
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Sistema', text: 'Bienvenido a la consulta virtual. El chat está disponible durante la sesión.' },
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Herramientas
  const [activePainMap, setActivePainMap] = useState(null);

  // ========== DEBUGGING ==========
  useEffect(() => {
    // Log cada vez que el video remoto cambia
    console.log("Estado de remoteVideoRef:", remoteVideoRef.current?.srcObject);
  }, [connected]);

  // ========== WEBRTC Y WEBSOCKET ==========
  useEffect(() => {
    console.log(`Inicializando sala ${roomCode} como ${userRole}`);
    
    // Inicializar la cámara y el micrófono
    const initAll = async () => {
      try {
        await initLocalMedia();
        addChatMessage('Sistema', 'Cámara y micrófono inicializados correctamente');
        
        // Conectar al WebSocket después de tener acceso a medios
        connectWebSocket();
      } catch (err) {
        console.error("Error durante la inicialización:", err);
        setErrorMessage(`Error de inicialización: ${err.message}`);
      }
    };
    
    initAll();

    // Limpiar al desmontar
    return () => {
      closeConnection();
    };
  }, [roomCode]);

  // Inicializar medios locales (cámara y micrófono)
  const initLocalMedia = async () => {
    console.log("Inicializando medios locales...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      console.log("Stream local obtenido:", stream.id);
      console.log("Pistas de video:", stream.getVideoTracks().length);
      console.log("Pistas de audio:", stream.getAudioTracks().length);

      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("Video local configurado");
      }
      
      setConnecting(false);
      return stream;
    } catch (err) {
      console.error("Error al acceder a cámara/micrófono:", err);
      handleMediaError(err);
      throw err;
    }
  };

  // Manejar errores de acceso a medios
  const handleMediaError = (err) => {
    if (err.name === 'NotAllowedError') {
      setErrorMessage('Permiso denegado para cámara o micrófono. Habilita los permisos en tu navegador.');
    } else if (err.name === 'NotFoundError') {
      setErrorMessage('No se encontró cámara o micrófono. Verifica la conexión de tus dispositivos.');
    } else {
      setErrorMessage(`Error: ${err.message}`);
    }
    
    setCameraActive(false);
    setMicActive(false);
    setConnecting(false);
  };

  // Conectar al WebSocket
  const connectWebSocket = () => {
    console.log(`Conectando al WebSocket: ws://localhost:8000/ws/room/${roomCode}/`);
    
    // Usar wss:// para producción, ws:// para desarrollo local
    const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomCode}/`);
    
    socket.onopen = () => {
      console.log('Conectado al WebSocket');
      addChatMessage('Sistema', 'Conectado al servidor');
      wsRef.current = socket;
      
      // Enviar nuestro channel_name a todos en la sala
      socket.send(JSON.stringify({
        action: 'join',
        message: {
          userRole: userRole
        }
      }));
      
      console.log(`Usuario ${userRole} ha enviado acción join`);
    };

    socket.onerror = (event) => {
      console.error('Error de WebSocket:', event);
      setErrorMessage('Error de conexión con el servidor');
      setConnecting(false);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket cerrado: ${event.code} - ${event.reason}`);
      setConnected(false);
    };

    socket.onmessage = (event) => {
      console.log('Mensaje WebSocket recibido:', event.data);
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Error al procesar mensaje WebSocket:', error);
      }
    };
    
    wsRef.current = socket;
  };

  // Manejar mensajes recibidos por WebSocket
  const handleWebSocketMessage = async (data) => {
    console.log('Procesando mensaje WebSocket:', data);
    
    // Formato de mensaje directo (acción y mensaje)
    if (data.action && data.message) {
      console.log('Formato de mensaje directo detectado');
      
      const { action, message } = data;
      
      if (action === 'connected') {
        console.log('Conectado al servidor, channel_name:', message?.channel_name);
        // Guardar mi propio channel_name
        const myChannelName = message?.channel_name;
        if (myChannelName) {
          console.log('Mi channel_name es:', myChannelName);
        }
        return;
      }
      
      switch (action) {
        case 'join':
          console.log('Otro usuario se unió a la sala:', message);
          // Guardamos el channel_name del otro usuario
          remoteUserChannelRef.current = message.channel_name;
          
          if (userRole === 'physio') {
            console.log('Somos fisio, iniciando conexión con:', message.channel_name);
            setTimeout(() => {
              initConnection(message.channel_name);
            }, 1000);
          }
          break;
        
        case 'new-offer':
          console.log('Oferta recibida:', message);
          await handleOffer(message);
          break;
        
        case 'new-answer':
          console.log('Respuesta recibida:', message);
          await handleAnswer(message);
          break;
        
        case 'new-ice-candidate':
          console.log('ICE Candidate recibido:', message);
          await handleNewICECandidate(message);
          break;
        
        case 'chat-message':
          console.log('Mensaje de chat recibido:', message);
          addChatMessage(userRole === 'physio' ? 'Paciente' : 'Fisioterapeuta', message.text);
          break;
        
        default:
          console.log('Acción desconocida:', action);
      }
    }
  };
  
  // Manejar mensajes en formato v1 (compatibilidad)
  const handleWebSocketMessageV1 = async (data) => {
    const { action, message } = data;
    
    if (action === 'connected') {
      console.log('Conectado al servidor, channel_name:', message?.channel_name);
      return;
    }
    
    if (action === 'join') {
      console.log('Usuario se unió con formato v1:', message);
      // Si somos fisio, iniciamos conexión
      if (userRole === 'physio') {
        console.log('Somos fisio, iniciando conexión v1');
        setTimeout(() => {
          initConnection();
        }, 1000);
      }
      return;
    }
    
    if (action === 'new-offer') {
      console.log('Oferta recibida en formato v1:', message);
      await handleOfferV1(message);
      return;
    }
    
    if (action === 'new-answer') {
      console.log('Respuesta recibida en formato v1:', message);
      await handleAnswerV1(message);
      return;
    }
    
    console.log('Acción v1 no manejada:', action);
  };

  // Iniciar proceso de conexión
  const initConnection = (remoteChannel = null) => {
    console.log('Iniciando proceso de conexión con remoteChannel:', remoteChannel);
    createPeerConnection(remoteChannel);
    createAndSendOffer(remoteChannel);
  };

  // Crear conexión de pares WebRTC
  const createPeerConnection = (remoteChannel = null) => {
    console.log('Creando RTCPeerConnection...');
    
    // Configuración de STUN/TURN servers para atravesar NAT/Firewalls
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };
    
    const peerConnection = new RTCPeerConnection(configuration);
    console.log('RTCPeerConnection creada');
    
    // Agregar nuestras pistas de audio/video
    if (localStreamRef.current) {
      console.log('Añadiendo tracks locales a la conexión...');
      localStreamRef.current.getTracks().forEach(track => {
        console.log(`Añadiendo track: ${track.kind}`);
        peerConnection.addTrack(track, localStreamRef.current);
      });
    } else {
      console.error('No hay stream local al crear PeerConnection');
    }
    
    // Manejar ICE candidates
    peerConnection.onicecandidate = (event) => {
      console.log('Nuevo ICE candidate:', event.candidate);
      if (event.candidate) {
        sendICECandidate(event.candidate, remoteChannel);
      }
    };
    
    // Recibir stream remoto
    peerConnection.ontrack = (event) => {
      console.log('¡Stream remoto recibido!', event.streams[0]);
      if (remoteVideoRef.current && event.streams[0]) {
        console.log('Asignando stream remoto al elemento de video');
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnected(true);
        setConnecting(false);
        addChatMessage('Sistema', `${userRole === 'physio' ? 'Paciente' : 'Fisioterapeuta'} conectado a la videollamada.`);
      } else {
        console.error('remoteVideoRef no está disponible o no hay stream');
      }
    };
    
    // Estado de la conexión
    peerConnection.onconnectionstatechange = (event) => {
      console.log('Estado de conexión cambiado a:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'connected') {
        console.log('¡Conexión establecida correctamente!');
        setConnected(true);
        setConnecting(false);
      } else if (peerConnection.connectionState === 'disconnected' || 
                peerConnection.connectionState === 'failed') {
        console.log('Conexión perdida o fallida');
        setConnected(false);
        setErrorMessage('La conexión se ha perdido. Intenta recargar la página.');
      }
    };
    
    // Estado de ICE connection
    peerConnection.oniceconnectionstatechange = (event) => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
    };
    
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  };

  // Crear y enviar oferta
  const createAndSendOffer = async (remoteChannel = null) => {
    console.log('Creando oferta para:', remoteChannel);
    if (!peerConnectionRef.current) {
      console.log('No hay peerConnection, creando una nueva');
      createPeerConnection(remoteChannel);
    }
    
    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Oferta creada:', offer);
      await peerConnectionRef.current.setLocalDescription(offer);
      console.log('LocalDescription establecida');
      
      // Asegurarse de que tenemos un channel de destino
      if (!remoteChannel && remoteUserChannelRef.current) {
        remoteChannel = remoteUserChannelRef.current;
        console.log('Usando channel guardado:', remoteChannel);
      }
      
      if (remoteChannel) {
        sendWebSocketMessage({
          action: 'new-offer',
          message: {
            sdp: offer,
            receiver_channel_name: remoteChannel
          }
        });
        console.log('Oferta enviada a:', remoteChannel);
      } else {
        console.error('No hay canal de destino para enviar la oferta');
        // Fallback: enviar sin receiver_channel_name (broadcast)
        sendWebSocketMessage({
          action: 'new-offer',
          message: {
            sdp: offer
          }
        });
        console.log('Oferta enviada en broadcast (no óptimo)');
      }
    } catch (error) {
      console.error('Error al crear o enviar oferta:', error);
      setErrorMessage('Error al establecer la conexión de video');
    }
  };

  // Manejar oferta recibida
  const handleOffer = async (message) => {
    console.log('Procesando oferta recibida:', message);
    try {
      // Guardar el channel del remitente si está disponible
      if (message.sender_channel_name) {
        remoteUserChannelRef.current = message.sender_channel_name;
        console.log('Channel del remitente guardado:', remoteUserChannelRef.current);
      }
      
      if (!peerConnectionRef.current) {
        console.log('Creando peerConnection para procesar oferta');
        createPeerConnection(remoteUserChannelRef.current);
      }
      
      const offer = new RTCSessionDescription(message.sdp);
      
      if (peerConnectionRef.current.signalingState !== 'stable') {
        console.log('No se puede procesar la oferta en estado:', peerConnectionRef.current.signalingState);
        return;
      }
      
      console.log('Estableciendo oferta como RemoteDescription');
      await peerConnectionRef.current.setRemoteDescription(offer);
      
      console.log('Creando respuesta...');
      const answer = await peerConnectionRef.current.createAnswer();
      console.log('Respuesta creada:', answer);
      
      console.log('Estableciendo respuesta como LocalDescription');
      await peerConnectionRef.current.setLocalDescription(answer);
      
      // Determinar a quién enviar la respuesta
      const receiverChannel = message.sender_channel_name || remoteUserChannelRef.current;
      
      if (receiverChannel) {
        console.log('Enviando respuesta a:', receiverChannel);
        sendWebSocketMessage({
          action: 'new-answer',
          message: {
            sdp: answer,
            receiver_channel_name: receiverChannel
          }
        });
      } else {
        console.warn('No hay canal definido para respuesta, enviando broadcast');
        sendWebSocketMessage({
          action: 'new-answer',
          message: {
            sdp: answer
          }
        });
      }
    } catch (error) {
      console.error('Error al manejar oferta:', error);
      setErrorMessage('Error al procesar la oferta de conexión');
    }
  };
  
  // Manejar oferta recibida (formato v1)
  const handleOfferV1 = async (message) => {
    console.log('Procesando oferta V1:', message);
    try {
      if (!peerConnectionRef.current) {
        console.log('Creando peerConnection para procesar oferta V1');
        createPeerConnection();
      }
      
      const offer = new RTCSessionDescription(message.sdp);
      
      console.log('Estableciendo oferta V1 como RemoteDescription');
      await peerConnectionRef.current.setRemoteDescription(offer);
      
      console.log('Creando respuesta V1...');
      const answer = await peerConnectionRef.current.createAnswer();
      console.log('Respuesta V1 creada:', answer);
      
      console.log('Estableciendo respuesta V1 como LocalDescription');
      await peerConnectionRef.current.setLocalDescription(answer);
      
      console.log('Enviando respuesta V1');
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'new-answer',
          message: { sdp: answer }
        }));
      }
    } catch (error) {
      console.error('Error al manejar oferta V1:', error);
    }
  };

  // Manejar respuesta recibida
  const handleAnswer = async (message) => {
    console.log('Procesando respuesta recibida:', message);
    try {
      if (!peerConnectionRef.current) {
        console.error('No hay peerConnection al recibir respuesta');
        return;
      }
      
      const answer = new RTCSessionDescription(message.sdp);
      
      if (peerConnectionRef.current.signalingState === 'have-local-offer') {
        console.log('Estableciendo respuesta como RemoteDescription');
        await peerConnectionRef.current.setRemoteDescription(answer);
        console.log('Respuesta procesada correctamente');
      } else {
        console.log('No se puede procesar la respuesta en estado:', peerConnectionRef.current.signalingState);
      }
    } catch (error) {
      console.error('Error al manejar respuesta:', error);
    }
  };
  
  // Manejar respuesta recibida (formato v1)
  const handleAnswerV1 = async (message) => {
    console.log('Procesando respuesta V1:', message);
    try {
      if (!peerConnectionRef.current) {
        console.error('No hay peerConnection al recibir respuesta V1');
        return;
      }
      
      const answer = new RTCSessionDescription(message.sdp);
      
      console.log('Estableciendo respuesta V1 como RemoteDescription');
      await peerConnectionRef.current.setRemoteDescription(answer);
      console.log('Respuesta V1 procesada correctamente');
    } catch (error) {
      console.error('Error al manejar respuesta V1:', error);
    }
  };

  // Manejar ICE candidates
  const handleNewICECandidate = async (message) => {
    console.log('Procesando ICE candidate:', message);
    try {
      if (!peerConnectionRef.current) {
        console.error('No hay peerConnection al recibir ICE candidate');
        return;
      }
      
      if (message.candidate) {
        console.log('Añadiendo ICE candidate a la conexión');
        const candidate = new RTCIceCandidate(message.candidate);
        await peerConnectionRef.current.addIceCandidate(candidate);
        console.log('ICE candidate añadido correctamente');
      }
    } catch (error) {
      console.error('Error al añadir ICE candidate:', error);
    }
  };

  // Enviar ICE candidate
  const sendICECandidate = (candidate, receiverChannelName) => {
    // Asegurarse de que tenemos un canal de destino
    const targetChannel = receiverChannelName || remoteUserChannelRef.current;
    
    if (targetChannel) {
      console.log('Enviando ICE candidate a:', targetChannel);
      sendWebSocketMessage({
        action: 'new-ice-candidate',
        message: {
          candidate: candidate,
          receiver_channel_name: targetChannel
        }
      });
    } else {
      console.warn('No hay canal de destino para ICE candidate, intentando broadcast');
      sendWebSocketMessage({
        action: 'new-ice-candidate',
        message: {
          candidate: candidate
        }
      });
    }
  };

  // Enviar mensaje WebSocket
  const sendWebSocketMessage = (data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('Enviando mensaje WebSocket:', data);
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket no está conectado');
      setErrorMessage('Error: No hay conexión con el servidor');
    }
  };

  // Cerrar conexión
  const closeConnection = () => {
    console.log('Cerrando conexiones...');
    
    // Detener todos los tracks del stream local
    if (localStreamRef.current) {
      console.log('Deteniendo tracks locales');
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Track ${track.kind} detenido`);
      });
    }
    
    // Cerrar la conexión de pares
    if (peerConnectionRef.current) {
      console.log('Cerrando RTCPeerConnection');
      peerConnectionRef.current.close();
    }
    
    // Cerrar WebSocket
    if (wsRef.current) {
      console.log('Cerrando WebSocket');
      wsRef.current.close();
    }
    
    setConnected(false);
    console.log('Todas las conexiones cerradas');
  };

  // ========== CONTROLES DE LA LLAMADA ==========
  
  // Toggle micrófono
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !micActive;
        setMicActive(!micActive);
        addChatMessage('Sistema', `Micrófono ${!micActive ? 'activado' : 'desactivado'}`);
      }
    }
  };

  // Toggle cámara
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !cameraActive;
        setCameraActive(!cameraActive);
        addChatMessage('Sistema', `Cámara ${!cameraActive ? 'activada' : 'desactivada'}`);
      }
    }
  };

  // Compartir pantalla
  const toggleScreenShare = async () => {
    if (isSharing) {
      stopScreenShare();
    } else {
      await startScreenShare();
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { cursor: 'always' }, 
        audio: false 
      });
      
      // Guardar track de video original para restaurar después
      const videoTrack = screenStream.getVideoTracks()[0];
      
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track && sender.track.kind === 'video'
        );
        
        if (videoSender) {
          await videoSender.replaceTrack(videoTrack);
        }
        
        // Mostrar pantalla compartida en el video local
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        // Manejar cuando el usuario detiene la compartición
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
      if (peerConnectionRef.current && localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        
        if (videoTrack) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => 
            sender.track && sender.track.kind === 'video'
          );
          
          if (videoSender) {
            await videoSender.replaceTrack(videoTrack);
          }
          
          // Restaurar video local
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
        }
        
        setIsSharing(false);
        addChatMessage('Sistema', 'Has dejado de compartir tu pantalla');
      }
    } catch (error) {
      console.error('Error al detener compartición:', error);
    }
  };

  // Finalizar llamada
  const endCall = () => {
    closeConnection();
    addChatMessage('Sistema', 'Has finalizado la llamada');
    // Redirigir o cambiar el estado para mostrar pantalla de finalización
  };

  // ========== CHAT ==========
  
  // Efecto para auto-scroll en chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Añadir mensaje al chat
  const addChatMessage = (sender, text) => {
    setChatMessages(prev => [...prev, { sender, text }]);
  };

  // Enviar mensaje de chat
  const sendChatMessage = () => {
    if (messageInput.trim() === '') return;
    
    sendWebSocketMessage({
      action: 'chat-message',
      message: {
        text: messageInput
      }
    });
    
    addChatMessage(userRole === 'physio' ? 'Fisioterapeuta' : 'Paciente', messageInput);
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

  // ========== HERRAMIENTAS ==========
  
  // Manejar selección de mapa de dolor
  const handlePainMapSelect = (mapId) => {
    setActivePainMap(mapId);
  };

  const sendPainMapToPatient = () => {
    if (activePainMap) {
      sendWebSocketMessage({
        action: 'pain-map',
        message: {
          mapId: activePainMap
        }
      });
      
      addChatMessage('Sistema', `Mapa de dolor "${activePainMap}" enviado al paciente.`);
    }
  };

  // El fisioterapeuta sí ve las herramientas; el paciente no
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
      
      {/* Botón de reconexión */}
      {!connected && !connecting && (
        <div className={styles.reconnectContainer}>
          <button 
            className={styles.reconnectButton}
            onClick={() => {
              if (userRole === 'physio') {
                initConnection(remoteUserChannelRef.current);
              }
            }}
          >
            Reconectar
          </button>
        </div>
      )}
    </div>
  );
};

export default Room;