import Room from '../Room';

export default function RoomPage({ params }) {
    return <Room roomCode={params.roomCode} />;
}
