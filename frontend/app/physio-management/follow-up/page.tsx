'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import RestrictedAccess from '@/components/RestrictedAccess';
import { getApiBaseUrl } from "@/utils/api";
import axios from "axios";

// Definir las interfaces para los datos
interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Patient {
  id?: number;
  user: User;
  gender: string;
  birth_date: string;
}

interface Physiotherapist {
  user: User;
  bio?: string;
  autonomic_community: string;
  rating_avg?: number;
  birth_date: string;
  collegiate_number: string;
  gender: string;
}

interface Treatment {
  id: number;
  physiotherapist: Physiotherapist | number;
  patient: Patient | number;
  start_time: string;
  end_time: string;
  homework: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface para formulario de creación
// interface NewTreatmentForm {
//   patient: number;
//   start_time: string;
//   end_time: string;
//   homework: string;
//   is_active: boolean;
// }

const SeguimientoPage = () => {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<Treatment[]>([]);
  const [activePatients, setActivePatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            Authorization: "Bearer " + storedToken
          }
        })
        .then(response => {
          setUserRole(response.data.user_role);
        })
        .catch(error => {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        });
      }
    }
  }, [isClient]);
  const extractActivePatients = useCallback((treatmentsData: Treatment[]) => {
    const activePatientsMap = new Map<number, Patient>();

    treatmentsData.forEach((treatment) => {
      if (treatment.is_active && typeof treatment.patient === "object") {
        const patientId = (treatment.patient as Patient).id;
        if (patientId && !activePatientsMap.has(patientId)) {
          activePatientsMap.set(patientId, {
            ...(treatment.patient as Patient),
            id: patientId,
          });
        }
      }
    });

    // Para desarrollo, si no hay pacientes, usar datos de ejemplo
    if (activePatientsMap.size === 0) {
      // Agregar un paciente de ejemplo
      activePatientsMap.set(1, {
        id: 1,
        user: {
          first_name: "María",
          last_name: "López Sánchez",
          email: "paciente_test@ejemplo.com",
          username: "paciente_test",
        },
        gender: "F",
        birth_date: "1990-05-15",
      });
    }

    setActivePatients(Array.from(activePatientsMap.values()));
  }, []);
  console.log(activePatients);

  // Cargar tratamientos desde la API
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        
        // Intentamos obtener los datos del backend
        try {
          // Usar token si está disponible en localStorage
          const token = localStorage.getItem('token') || '';

          let url = 'http://localhost:8000/api/treatments/physio/';
          if (activeFilter !== null) {
            url += `?is_active=${activeFilter}`;
          }
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Error al obtener los tratamientos');
          }
          
          const data = await response.json();
          console.log('Datos de tratamientos:', data);
          setTreatments(data);
          setFilteredTreatments(data);
          
          // Extraer pacientes únicos con tratamientos activos
          extractActivePatients(data);
        } catch (fetchError) {
          console.error('Error al obtener datos del backend:', fetchError);

        }
      } catch (err) {
        console.error('Error general:', err);
        setError('No se pudieron cargar los tratamientos. Por favor, inténtalo de nuevo.');
        
      } finally {
        setLoading(false);
      }
    };
  fetchTreatments();
}, [extractActivePatients, activeFilter]);

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
      result = result.filter((t) => {
        // Verificar si patient es un objeto y tiene user
        if (typeof t.patient === 'object' && t.patient && 'user' in t.patient) {
          const patientUser = t.patient.user;
          return (
            patientUser.first_name.toLowerCase().includes(term) || 
            patientUser.last_name.toLowerCase().includes(term)
          );
        }
        return false;
      });
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
    router.push(`/physio-management/follow-up/${id}`);
  };

  // Función para obtener el nombre del paciente
  const getPatientName = (treatment: Treatment) => {
    if (typeof treatment.patient === 'object' && treatment.patient && 'user' in treatment.patient) {
      return `${treatment.patient.user.first_name} ${treatment.patient.user.last_name}`;
    }
    return `Paciente ID: ${treatment.patient}`;
  };
  
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!token) {
    return <RestrictedAccess message="Necesitas iniciar sesión para acceder a los tratamientos." />;
  }

  if (userRole === "patient") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full transition-all duration-300"
             style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)" }}>
          <h2 className="text-2xl font-bold mb-4"
              style={{ 
                background: "linear-gradient(90deg, #1E5ACD, #3a6fd8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
            Próximamente
          </h2>
          <p className="text-gray-700 mb-6">
            🚀 La vista de seguimiento para pacientes estará disponible próximamente. Estamos trabajando para ofrecerte la mejor experiencia posible.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 w-full"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (userRole !== "physiotherapist") {
    return <RestrictedAccess message="Esta sección está reservada para fisioterapeutas." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Seguimiento de Tratamientos</h1>

      </div>
      
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
                className={`px-4 py-2 rounded-xl transition ${
                  activeFilter === null
                    ? 'bg-[#6bc9be] text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleFilterChange(true)}
                className={`px-4 py-2 rounded-xl transition ${
                  activeFilter === true
                    ? 'bg-[#6bc9be] text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Activos
              </button>
              <button
                onClick={() => handleFilterChange(false)}
                className={`px-4 py-2 rounded-xl transition ${
                  activeFilter === false
                    ? 'bg-[#6bc9be] text-white'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => handleCardClick(treatment.id)}
            >
              <div className={`p-1 text-center text-white ${treatment.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
                {treatment.is_active ? 'Activo' : 'Histórico'}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{getPatientName(treatment)}</h3>
                
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

export default SeguimientoPage;