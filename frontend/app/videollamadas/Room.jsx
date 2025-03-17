'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Room.module.css';

// Components
import RoomHeader from './RoomHeader';
import VideoGrid from './VideoGrid';
import Controls from './Controls';
import ChatPanel from './ChatPanel';
import SettingsPanel from './SettingsPanel';
import ToolsContainer from './ToolsContainer';
import ToolPanel from './ToolPanel';
import RoomModal from './RoomModal';

// Custom hooks
import useWebSocket from './hooks/useWebSocket';
import useWebRTC from './hooks/useWebRTC';
import useMediaControls from './hooks/useMediaControls';
import useChat from './hooks/useChat';
import useRoomManagement from './hooks/useRoomManagement';

/**
 * Main Room component for video call
 * @param {Object} props - Component props
 * @param {string} props.roomCode - Room ID/code
 * @returns {JSX.Element} Room component
 */
const Room = ({ roomCode }) => {
  const searchParams = useSearchParams();
  const userRole = searchParams.get('role') || 'physio';

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activePainMap, setActivePainMap] = useState(null);

  // First initialize WebSocket hook with a dummy message handler
  const webSocket = useWebSocket(
    roomCode,
    userRole,
    () => {} // Placeholder to be updated later
  );

  // Initialize chat hook
  const chat = useChat({
    userRole,
    sendWebSocketMessage: webSocket.sendWebSocketMessage
  });

  // Initialize WebRTC hook
  const webRTC = useWebRTC({
    localStreamRef,
    localVideoRef,
    remoteVideoRef,
    userRole,
    addChatMessage: chat.addChatMessage,
    sendWebSocketMessage: webSocket.sendWebSocketMessage
  });
  
  // Initialize media controls hook
  const mediaControls = useMediaControls({
    localStreamRef,
    localVideoRef,
    peerConnectionRef: webRTC.peerConnectionRef,
    addChatMessage: chat.addChatMessage,
    setErrorMessage: webRTC.setErrorMessage,
    setConnecting: webRTC.setConnecting
  });

  // Initialize room management hook
  const roomManagement = useRoomManagement({
    roomCode,
    userRole,
    closeConnection: () => {
      webRTC.closeConnection();
      webSocket.closeWebSocket();
      mediaControls.cleanupMedia();
    },
    cleanupMedia: mediaControls.cleanupMedia,
    sendWebSocketMessage: webSocket.sendWebSocketMessage,
    addChatMessage: chat.addChatMessage
  });

  const [modelState, setModelState] = useState({
    selectedPart: null,
    wireframe: false,
    isSharing: false,
    modelId: 1 // ID del modelo por defecto
  });
  
  // Now we can update the WebSocket message handler after all hooks are initialized
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      if (data.action && data.message) {
        switch (data.action) {
          case 'chat-message':
            chat.handleChatMessage(data.message);
            break;
          case 'call-ended':
            roomManagement.handleCallEnded();
            break;
          case 'anatomical-model-interaction':
            if (data.message.type === 'select-part') {
              setModelState(prev => ({ ...prev, selectedPart: data.message.partName }));
              chat.addChatMessage('Sistema', `Parte seleccionada: ${data.message.partName}`);
            } else if (data.message.type === 'toggle-wireframe') {
              setModelState(prev => ({ ...prev, wireframe: data.message.wireframe }));
              chat.addChatMessage('Sistema', `Wireframe: ${data.message.wireframe ? 'activado' : 'desactivado'}`);
            } else if (data.message.type === 'start-sharing') {
              setModelState(prev => ({
                ...prev,
                isSharing: true,
                modelId: data.message.modelId,
                selectedPart: data.message.selectedPart,
                wireframe: data.message.wireframe
              }));
              chat.addChatMessage('Sistema', 'Modelo anatómico compartido.');
            } else if (data.message.type === 'stop-sharing') {
              setModelState(prev => ({ ...prev, isSharing: false }));
              chat.addChatMessage('Sistema', 'Compartir modelo detenido.');
            } else if (data.message.type === 'change-model') {
              setModelState(prev => ({ ...prev, modelId: data.message.modelId }));
              chat.addChatMessage('Sistema', `Modelo cambiado a ID: ${data.message.modelId}`);
            }
            break;
          default:
            webRTC.handleWebSocketMessage(data);
        }
      }
    };
    
    webSocket.setMessageHandler(handleWebSocketMessage);
  }, [chat, webRTC, webSocket, roomManagement]);

  // Initialize everything when component mounts
  useEffect(() => {
    console.log(`Inicializando sala ${roomCode} como ${userRole}`);
    
    const initAll = async () => {
      try {
        await mediaControls.initLocalMedia();
        chat.addChatMessage('Sistema', 'Cámara y micrófono inicializados correctamente');
        
        // Connect to WebSocket after media access
        webSocket.connectWebSocket();
      } catch (err) {
        console.error("Error durante la inicialización:", err);
        webRTC.setErrorMessage(`Error de inicialización: ${err.message}`);
      }
    };
    
    initAll();

    // Cleanup on unmount
    return () => {
      webRTC.closeConnection();
      webSocket.closeWebSocket();
      mediaControls.cleanupMedia();
    };
  }, [roomCode]);

  // Log remote video ref changes for debugging
  useEffect(() => {
    console.log("Estado de remoteVideoRef:", remoteVideoRef.current?.srcObject);
  }, [webRTC.connected]);

  // Tool-related functions
  const handlePainMapSelect = (mapId) => {
    setActivePainMap(mapId);
  };

  const sendPainMapToPatient = () => {
    if (activePainMap) {
      webSocket.sendWebSocketMessage({
        action: 'pain-map',
        message: {
          mapId: activePainMap
        }
      });
      
      chat.addChatMessage('Sistema', `Mapa de dolor "${activePainMap}" enviado al paciente.`);
    }
  };

  // Show tools only for physio role
  const showTools = (userRole === 'physio');

  return (
    <div className={styles.roomContainer}>
      <RoomHeader 
        roomCode={roomCode} 
        errorMessage={webRTC.errorMessage || webSocket.errorMessage}
      />
      
      {/* Modal for notifications and confirmations */}
      <RoomModal
        show={roomManagement.showModal}
        message={roomManagement.modalMessage}
        showButtons={roomManagement.showDeleteButtons}
        userRole={userRole}
        onConfirm={roomManagement.confirmDeleteRoom}
        onCancel={roomManagement.cancelDelete}
        onClose={() => window.location.href = '/videollamadas'}
      />

      {/* Video grid */}
      <VideoGrid 
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        cameraActive={mediaControls.cameraActive}
        connected={webRTC.connected}
        isSharing={mediaControls.isSharing}
        userRole={userRole}
      />

      {/* Call controls */}
      <Controls 
        micActive={mediaControls.micActive}
        cameraActive={mediaControls.cameraActive}
        toggleMic={mediaControls.toggleMic}
        toggleCamera={mediaControls.toggleCamera}
        toggleScreenShare={mediaControls.toggleScreenShare}
        showChat={chat.showChat}
        setShowChat={chat.setShowChat}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        endCall={roomManagement.endCall}
      />

      {/* Chat panel */}
      <ChatPanel 
        showChat={chat.showChat}
        chatMessages={chat.chatMessages}
        chatMessagesRef={chat.chatMessagesRef}
        messageInput={chat.messageInput}
        setMessageInput={chat.setMessageInput}
        handleKeyPress={chat.handleKeyPress}
        sendChatMessage={chat.sendChatMessage}
        messageInputRef={chat.messageInputRef}
      />

      {/* Settings panel */}
      <SettingsPanel
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Tools (physio only) */}
      {showTools && (
  <>
    <ToolsContainer 
      selectedTool={selectedTool}
      setSelectedTool={setSelectedTool}
      toggleScreenShare={mediaControls.toggleScreenShare} 
    />
    {selectedTool && (
      <ToolPanel 
        selectedTool={selectedTool}
        activePainMap={activePainMap}
        handlePainMapSelect={handlePainMapSelect}
        sendPainMapToPatient={sendPainMapToPatient}
        userRole={userRole} // Pasamos solo userRole
      />
    )}
  </>
)}
      
      {/* Reconnect button */}
      {!webRTC.connected && !webRTC.connecting && (
        <div className={styles.reconnectContainer}>
          <button 
            className={styles.reconnectButton}
            onClick={() => {
              if (userRole === 'physio') {
                webRTC.initConnection(webRTC.remoteUserChannelRef.current);
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