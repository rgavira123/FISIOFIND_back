'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Definir la interfaz para el tratamiento
interface Patient {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  gender: string;
  birth_date: string;
}

interface Treatment {
  id: number;
  patient: Patient;
  start_time: string;
  end_time: string;
  homework: string;
  is_active: boolean;
}

const SeguimientoPage = () => {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar tratamientos mock directamente para evitar errores con la API
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        // Usamos directamente los datos mock sin intentar hacer fetch
        const mockTreatments = getMockTreatments();
        setTreatments(mockTreatments);
        setFilteredTreatments(mockTreatments);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudieron cargar los tratamientos. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...treatments];
    
    // Filtrar por estado activo/inactivo
    if (activeFilter !== null) {
      result = result.filter((t) => t.is_active === activeFilter);
    }
    
    // Filtrar por término de búsqueda (nombre del paciente)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) => 
          t.patient.user.first_name.toLowerCase().includes(term) || 
          t.patient.user.last_name.toLowerCase().includes(term)
      );
    }
    
    setFilteredTreatments(result);
  }, [activeFilter, searchTerm, treatments]);

  const handleFilterChange = (isActive: boolean | null) => {
    setActiveFilter(isActive);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCardClick = (id: number) => {
    router.push(`/gestion-fisio/seguimiento/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seguimiento de Tratamientos</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">Filtrar por estado</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange(null)}
                className={`px-4 py-2 rounded-md transition ${
                  activeFilter === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleFilterChange(true)}
                className={`px-4 py-2 rounded-md transition ${
                  activeFilter === true
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => handleFilterChange(false)}
                className={`px-4 py-2 rounded-md transition ${
                  activeFilter === false
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Históricos
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="block text-lg font-semibold mb-2">
              Buscar paciente
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre del paciente..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {filteredTreatments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No se encontraron tratamientos con los filtros seleccionados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredTreatments.map((treatment) => (
            <div 
              key={treatment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => handleCardClick(treatment.id)}
            >
              <div className={`p-1 text-center text-white ${treatment.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
                {treatment.is_active ? 'Activo' : 'Histórico'}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{treatment.patient.user.first_name} {treatment.patient.user.last_name}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Inicio:</span>
                    <span>{new Date(treatment.start_time).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Fin:</span>
                    <span>{new Date(treatment.end_time).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={treatment.is_active ? "text-green-500" : "text-gray-500"}>
                      {treatment.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Deberes asignados:</h4>
                  <p className="text-gray-700 text-sm line-clamp-2">{treatment.homework}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-center">
                <button className="text-blue-500 hover:underline">
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Función para generar datos de ejemplo para desarrollo
function getMockTreatments(): Treatment[] {
  return [
    {
      id: 1,
      patient: {
        user: {
          first_name: 'Ana',
          last_name: 'García',
          email: 'ana.garcia@ejemplo.com'
        },
        gender: 'F',
        birth_date: '1990-05-15'
      },
      start_time: '2025-01-01T10:00:00Z',
      end_time: '2025-04-01T10:00:00Z',
      homework: 'Realizar ejercicios de estiramiento de espalda 3 veces al día.',
      is_active: true
    },
    {
      id: 2,
      patient: {
        user: {
          first_name: 'Carlos',
          last_name: 'Rodríguez',
          email: 'carlos.rodriguez@ejemplo.com'
        },
        gender: 'M',
        birth_date: '1985-10-22'
      },
      start_time: '2025-02-15T14:30:00Z',
      end_time: '2025-05-15T14:30:00Z',
      homework: 'Ejercicios de fortalecimiento de rodilla. Series de 15 repeticiones.',
      is_active: true
    },
    {
      id: 3,
      patient: {
        user: {
          first_name: 'María',
          last_name: 'López',
          email: 'maria.lopez@ejemplo.com'
        },
        gender: 'F',
        birth_date: '1992-03-08'
      },
      start_time: '2025-01-10T09:15:00Z',
      end_time: '2025-02-10T09:15:00Z',
      homework: 'Rehabilitación post-quirúrgica de hombro.',
      is_active: false
    },
    {
      id: 4,
      patient: {
        user: {
          first_name: 'Juan',
          last_name: 'Martínez',
          email: 'juan.martinez@ejemplo.com'
        },
        gender: 'M',
        birth_date: '1988-12-17'
      },
      start_time: '2025-03-05T16:00:00Z',
      end_time: '2025-06-05T16:00:00Z',
      homework: 'Tratamiento para dolor lumbar crónico. Ejercicios de core.',
      is_active: true
    }
  ];
}

export default SeguimientoPage;