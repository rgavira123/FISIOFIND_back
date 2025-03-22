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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push(`/gestion-fisio/seguimiento/${treatmentId}`)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-xl inline-flex items-center mb-6"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sesiones del Tratamiento</h1>
        
        <form onSubmit={handleCreateSession} className="mb-8 p-6 bg-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Crear Nueva Sesión</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 sr-only">Nombre de la Sesión</label>
              <input
                type="text"
                value={newSession.name}
                onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Nombre de la sesión"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 sr-only">Día de la Semana</label>
              <select
                value={newSession.day_of_week}
                onChange={(e) => setNewSession({ ...newSession, day_of_week: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mb-8 mt-8 px-6 py-3 bg-[#6bc9be] text-white font-medium rounded-xl hover:bg-[#5ab8ad] focus:outline-none focus:ring-2 focus:ring-[#6bc9be] focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
          >
            Crear Sesión
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{session.name || `Sesión ${session.id}`}</h3>
              <p className="text-gray-600 mb-4">
                Día: {daysOfWeek.find(day => day.value === session.day_of_week)?.label}
              </p>
              <button
                onClick={() => router.push(`/gestion-fisio/seguimiento/${treatmentId}/sesiones/${session.id}/ejercicios`)}
                className="w-full px-6 py-3 bg-[#05668d] text-white font-medium rounded-xl hover:bg-[#045a7d] focus:outline-none focus:ring-2 focus:ring-[#05668d] focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Gestionar Ejercicios</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionsPage;