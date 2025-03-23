"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";
import { IconHeart, IconHeadphones } from "@tabler/icons-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface RoomDetails {
  code: string;
  created_at: string;
}

const VideoCallPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [userRole, setUserRole] = useState<"physio" | "patient" | null>("physio");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createRoom = async () => {
    if (!userRole) {
      alert("Selecciona un rol antes de crear la sala.");
      return;
    }

    if (userRole === "patient") {
      setModalMessage("Lo sentimos, los pacientes no pueden crear salas.");
      setShowModal(true);
      return;
    }

    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      try {
        const response = await axios.post(`${getApiBaseUrl()}/api/videocall/create-room/`);
        setRoomCode(response.data.code);
        window.location.href = `/videocalls/${response.data.code}?role=${userRole}`;
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  const joinRoom = async () => {
    if (!userRole) {
      alert("Selecciona un rol antes de unirte a la sala.");
      return;
    }

    if (!code || code.trim() === '') {
      alert("Por favor, ingresa un código de sala válido.");
      return;
    }

    try {
      const response = await axios.get(`${getApiBaseUrl()}/api/videocall/join-room/${code}/`);
      setRoomDetails(response.data);
      window.location.href = `/videocalls/${response.data.code}?role=${userRole}`;
    } catch (error) {
      console.error("Error joining room:", error);
      setRoomDetails(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" 
         style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)" }}>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Aviso</h3>
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="text-white py-2 px-4 rounded-xl transition-all duration-200"
              style={{ backgroundColor: "#1E5ACD" }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-[480px] rounded-3xl shadow-xl p-10 transition-all duration-300"
           style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
        
        <div className="text-center mb-9">
          <h1 className="text-3xl font-bold mb-2"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Videollamadas
          </h1>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-700 mb-8">Selecciona tu rol:</h2>
        
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="radio"
              name="role"
              id="fisio"
              value="physio"
              checked={userRole === "physio"}
              onChange={() => setUserRole("physio")}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
            <label 
              htmlFor="fisio" 
              className={`block bg-gray-50 border-2 ${userRole === "physio" ? "border-[#1E5ACD] bg-gradient-to-b from-blue-50 to-[#e8effa] shadow-md" : "border-gray-200"} rounded-2xl p-6 text-center transition-all duration-200 flex flex-col items-center h-full`}
              style={userRole === "physio" ? {boxShadow: "0 4px 12px rgba(30, 90, 205, 0.15)"} : {}}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-[#e8effa] flex items-center justify-center mb-4">
                <IconHeart className="text-[#1E5ACD]" size={28} />
              </div>
              <div className="font-semibold text-gray-700 mb-1">Fisioterapeuta</div>
              <div className="text-sm text-gray-500">(Host)</div>
            </label>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="radio"
              name="role"
              id="paciente"
              value="patient"
              checked={userRole === "patient"}
              onChange={() => setUserRole("patient")}
              className="absolute opacity-0 w-full h-full cursor-pointer"
            />
            <label 
              htmlFor="paciente" 
              className={`block bg-gray-50 border-2 ${userRole === "patient" ? "border-[#05AC9C] bg-gradient-to-b from-[#e6f7f6] to-[#e6f7f6] shadow-md" : "border-gray-200"} rounded-2xl p-6 text-center transition-all duration-200 flex flex-col items-center h-full`}
              style={userRole === "patient" ? {boxShadow: "0 4px 12px rgba(5, 172, 156, 0.15)"} : {}}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-[#e6f7f6] flex items-center justify-center mb-4">
                <IconHeadphones className="text-[#05AC9C]" size={28} />
              </div>
              <div className="font-semibold text-gray-700 mb-1">Paciente</div>
              <div className="text-sm text-gray-500">(Visualización)</div>
            </label>
          </div>
        </div>
        
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Ingresa el código de la sala"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full py-[18px] px-5 text-base border-2 border-gray-200 rounded-xl transition-all duration-200 outline-none focus:border-[#1E5ACD] focus:shadow-[0_0_0_4px_rgba(30,90,205,0.1)]"
          />
        </div>
        
        <div className="space-y-4">
          <GradientButton 
            variant="create" 
            fullWidth 
            onClick={createRoom}
          >
            Crear Sala
          </GradientButton>
          
          <GradientButton 
            variant="edit" 
            fullWidth 
            onClick={joinRoom}
          >
            Unirse a la Sala
          </GradientButton>
        </div>
        
        {roomCode && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Código de la sala: <span className="font-semibold">{roomCode}</span>
            </p>
          </div>
        )}
        
        {roomDetails && (
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Unido a la Sala: <span className="font-semibold">{roomDetails.code}</span>
            </p>
            <p className="text-gray-600">
              Creada en: <span className="font-semibold">{roomDetails.created_at}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
