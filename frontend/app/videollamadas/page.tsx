'use client';

import { useState } from "react";
import axios from "axios";

const VideoCallPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [userRole, setUserRole] = useState<"physio" | "patient" | null>(null); // Estado del rol

  interface RoomDetails {
    code: string;
    created_at: string;
  }

  const createRoom = async () => {
    if (!userRole) {
      alert("Selecciona un rol antes de crear la sala.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/videocall/create-room/');
      setRoomCode(response.data.code);
      window.location.href = `/videollamadas/${response.data.code}?role=${userRole}`;
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    if (!userRole) {
      alert("Selecciona un rol antes de unirte a la sala.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/videocall/join-room/${code}/`);
      setRoomDetails(response.data);
      window.location.href = `/videollamadas/${response.data.code}?role=${userRole}`;
    } catch (error) {
      console.error("Error joining room:", error);
      setRoomDetails(null);
    }
  };

  return (
    <div>
      <h2>Videollamada</h2>
      
      {/* Selección de rol */}
      <div>
        <h3>Selecciona tu rol:</h3>
        <label>
          <input
            type="radio"
            name="role"
            value="physio"
            checked={userRole === "physio"}
            onChange={() => setUserRole("physio")}
          />
          Fisioterapeuta (Host)
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="patient"
            checked={userRole === "patient"}
            onChange={() => setUserRole("patient")}
          />
          Paciente (Visualización)
        </label>
      </div>

      {/* Crear Sala */}
      <div>
        <button onClick={createRoom}>Crear Sala</button>
        {roomCode && <p>Room code: {roomCode}</p>}
      </div>

      {/* Unirse a Sala */}
      <div>
        <input
          type="text"
          placeholder="Ingresa el código de la sala"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={joinRoom}>Unirse a la Sala</button>
        {roomDetails && (
          <div>
            <p>Unido a la Sala: {roomDetails.code}</p>
            <p>Creada en: {roomDetails.created_at}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
