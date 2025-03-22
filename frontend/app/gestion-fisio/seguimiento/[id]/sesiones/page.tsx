'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  id: number;
  name: string;
  treatment: number;
  day_of_week: string;
}

const SessionsPage = ({ params }: { params: { id: string } }) => {
  const treatmentId = params.id;
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSession, setNewSession] = useState({
    name: '',
    day_of_week: 'Monday'
  });

  const daysOfWeek = [
    { value: 'Monday', label: 'Lunes' },
    { value: 'Tuesday', label: 'Martes' },
    { value: 'Wednesday', label: 'Miércoles' },
    { value: 'Thursday', label: 'Jueves' },
    { value: 'Friday', label: 'Viernes' },
    { value: 'Saturday', label: 'Sábado' },
    { value: 'Sunday', label: 'Domingo' }
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se ha encontrado el token de autenticación');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/treatments/${treatmentId}/sessions/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las sesiones');
      }

      const data = await response.json();
      setSessions(data);
      console.log(sessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las sesiones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se ha encontrado el token de autenticación');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/treatments/${treatmentId}/sessions/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newSession,
          treatment: treatmentId
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la sesión');
      }

      await loadSessions();
      setNewSession({ name: '', day_of_week: 'Monday' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la sesión');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sesiones del Tratamiento</h1>
      
      <form onSubmit={handleCreateSession} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Sesión</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Sesión</label>
            <input
              type="text"
              value={newSession.name}
              onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Nombre de la sesión"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Día de la Semana</label>
            <select
              value={newSession.day_of_week}
              onChange={(e) => setNewSession({ ...newSession, day_of_week: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Crear Sesión
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">{session.name || `Sesión ${session.id}`}</h3>
            <p className="text-gray-600">
              Día: {daysOfWeek.find(day => day.value === session.day_of_week)?.label}
            </p>
            <button
              onClick={() => router.push(`/gestion-fisio/seguimiento/${treatmentId}/sesiones/${session.id}/ejercicios`)}
              className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Gestionar Ejercicios
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionsPage;