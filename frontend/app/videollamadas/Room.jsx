'use client';

import React, { useEffect, useState } from 'react';

const Room = ({ roomCode }) => {
    const [ws, setWs] = useState(null);
    const [offer, setOffer] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    useEffect(() => {
        // Conectar al WebSocket
        const socket = new WebSocket(`ws://localhost:8000/ws/room/${roomCode}/`);
        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.action === 'new-offer') {
                setOffer(data.message);
                await handleOffer(data.message);
            } else if (data.action === 'new-answer') {
                setAnswer(data.message);
                await handleAnswer(data.message);
            }
        };

        setWs(socket);

        // Obtener el stream local (cámara y micrófono)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                const videoElement = document.getElementById('localVideo');
                videoElement.srcObject = stream;
            })
            .catch(err => console.log("Error accessing media devices: ", err));

        return () => socket.close();
    }, [roomCode]);

    const handleOffer = async (offer) => {
        // Crear la conexión de WebRTC
        const peer = new RTCPeerConnection();
        setPeerConnection(peer);

        // Agregar el stream local a la conexión
        localStream.getTracks().forEach(track => {
            peer.addTrack(track, localStream);
        });

        // Crear una respuesta (Answer)
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        // Enviar la respuesta (answer) al servidor WebSocket
        const answerMessage = {
            action: 'new-answer',
            message: { sdp: answer }
        };
        ws.send(JSON.stringify(answerMessage));

        // Enviar los candidatos ICE al servidor WebSocket
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                ws.send(JSON.stringify({
                    action: 'new-candidate',
                    message: { candidate: event.candidate }
                }));
            }
        };

        // Mostrar el video remoto cuando se recibe la conexión
        peer.ontrack = (event) => {
            const remoteVideo = document.getElementById('remoteVideo');
            remoteVideo.srcObject = event.streams[0];
        };
    };

    const handleAnswer = async (answer) => {
        if (peerConnection) {
            const desc = new RTCSessionDescription(answer);
            await peerConnection.setRemoteDescription(desc);
        }
    };

    const sendOffer = async () => {
        const peer = new RTCPeerConnection();

        // Agregar el stream local a la conexión
        localStream.getTracks().forEach(track => {
            peer.addTrack(track, localStream);
        });

        // Crear la oferta (Offer)
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        // Enviar la oferta (offer) al servidor WebSocket
        const offerMessage = { action: 'new-offer', message: { sdp: offer } };
        ws.send(JSON.stringify(offerMessage));

        // Enviar los candidatos ICE al servidor WebSocket
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                ws.send(JSON.stringify({
                    action: 'new-candidate',
                    message: { candidate: event.candidate }
                }));
            }
        };

        // Establecer la conexión remota
        peer.ontrack = (event) => {
            const remoteVideo = document.getElementById('remoteVideo');
            remoteVideo.srcObject = event.streams[0];
        };

        setPeerConnection(peer);
    };

    return (
        <div>
            <h2>Room: {roomCode}</h2>
            <div>
                <video id="localVideo" autoPlay muted></video>
                <video id="remoteVideo" autoPlay></video>
            </div>
            <button onClick={sendOffer}>Send Offer</button>
        </div>
    );
};

export default Room;
