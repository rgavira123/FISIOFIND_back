'use client';

import { useState } from "react";
import axios from "axios";

const VideoCallPage = () => {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);

  interface RoomDetails {
    code: string;
    created_at: string;
  }

  const createRoom = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/videocall/create-room/');
      setRoomCode(response.data.code);
      window.location.href = `/videollamadas/${response.data.code}`;


    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const joinRoom = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/videocall/join-room/${code}/`);
      setRoomDetails(response.data);
      window.location.href = `/videollamadas/${response.data.code}`;

    } catch (error) {
      console.error("Error joining room:", error);
      setRoomDetails(null);
    }
  };

  return (
    <div>
      <div>
        <button onClick={createRoom}>Create Room</button>
        {roomCode && <p>Room code: {roomCode}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter room code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
        {roomDetails && (
          <div>
            <p>Joined Room: {roomDetails.code}</p>
            <p>Created at: {roomDetails.created_at}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;
