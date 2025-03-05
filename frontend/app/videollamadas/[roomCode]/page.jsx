'use client';

import { useState, useEffect } from 'react';
import Room from '../Room';  

export default function RoomPage({ params }) {
  const roomCode = params.roomCode;
  // Usar un ID de key estable para evitar remontajes
  return <Room roomCode={roomCode} />;
}