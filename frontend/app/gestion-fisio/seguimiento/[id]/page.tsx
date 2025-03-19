'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

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

const TreatmentDetailPage = ({ params }: { params: { id: string } }) => {
  // En componentes cliente simplemente usamos el ID directamente
  const id = params.id;
  
  const router = useRouter();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatmentDetails = async () => {
      try {
        setLoading(true);
        
        // Usamos directamente los datos mock para evitar errores con la API
        const mockTreatment = getMockTreatment(parseInt(id));
        
        if (!mockTreatment) {
          setError('No se encontró el tratamiento solicitado');
        } else {
          setTreatment(mockTreatment);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudieron cargar los detalles del tratamiento. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentDetails();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  // Datos para los gráficos
  const mockChartData = {
    labels: ['14/02', '15/02', '16/02', '17/02', '18/02', '19/02', '20/02'],
    datasets: [
      {
        label: 'Mapa de dolor',
        data: [1, 2, 4, 4, 5, 6, 7],
        backgroundColor: 'rgb(204, 10, 52)',
        borderColor: 'rgb(204, 10, 52)',
      },
      {
        label: 'Evolución del peso',
        data: [10, 10, 9, 8, 4, 6, 5],
        backgroundColor: 'rgb(7, 194, 101)',
        borderColor: 'rgb(7, 194, 101)',
      },
      {
        label: 'Repeticiones',
        data: [2, 3, 4, 5, 5, 6, 8],
        backgroundColor: 'rgb(7, 35, 194)',
        borderColor: 'rgb(7, 35, 194)',
      }
    ],
  };

  // Lista de ejercicios de ejemplo
  const mockExercises = [
    { name: 'Ejercicio 1', completion: 0 },
    { name: 'Ejercicio 2', completion: 100 },
    { name: 'Ejercicio 3', completion: 100 },
    { name: 'Ejercicio 4', completion: 75 },
    { name: 'Ejercicio 5', completion: 50 },
    { name: 'Ejercicio 6', completion: 100 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={handleGoBack}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          ← Volver
        </button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'No se encontró el tratamiento solicitado'}
        </div>
      </div>
    );
  }

  // Calcular la edad a partir de la fecha de nacimiento
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Formatear la última cita
  const formatLastAppointment = () => {
    const date = new Date();
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={handleGoBack}
        className="mb-6 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition flex items-center"
      >
        <span className="mr-1">←</span> Volver a la lista
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">
            {treatment.patient.user.first_name} {treatment.patient.user.last_name}
          </h1>
          <span className={`px-3 py-1 rounded-full text-white ${treatment.is_active ? 'bg-green-500' : 'bg-gray-500'}`}>
            {treatment.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Información del tratamiento</h2>
            <p><span className="font-medium">Inicio:</span> {new Date(treatment.start_time).toLocaleDateString('es-ES')}</p>
            <p><span className="font-medium">Fin:</span> {new Date(treatment.end_time).toLocaleDateString('es-ES')}</p>
            <p><span className="font-medium">Deberes asignados:</span></p>
            <p className="bg-gray-50 p-3 rounded mt-1">{treatment.homework}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Información del paciente</h2>
            <p><span className="font-medium">Nombre completo:</span> {treatment.patient.user.first_name} {treatment.patient.user.last_name}</p>
            <p><span className="font-medium">Email:</span> {treatment.patient.user.email}</p>
            <p><span className="font-medium">Género:</span> {treatment.patient.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
            <p><span className="font-medium">Edad:</span> {calculateAge(treatment.patient.birth_date)} años</p>
            <p><span className="font-medium">Última cita:</span> {formatLastAppointment()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-5">Evolución del dolor</h2>
          <div className="h-80">
            <Line 
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }} 
              data={mockChartData} 
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-5">Progreso de ejercicios</h2>
          <div className="h-80 overflow-y-auto">
            {mockExercises.map((exercise, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{exercise.name}</span>
                  <span className={`font-bold ${
                    exercise.completion === 0 ? 'text-red-600' : 
                    exercise.completion < 50 ? 'text-orange-500' : 
                    exercise.completion < 100 ? 'text-yellow-500' : 
                    'text-green-600'
                  }`}>
                    {exercise.completion}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      exercise.completion === 0 ? 'bg-red-600' : 
                      exercise.completion < 50 ? 'bg-orange-500' : 
                      exercise.completion < 100 ? 'bg-yellow-500' : 
                      'bg-green-600'
                    }`}
                    style={{ width: `${exercise.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {treatment.is_active && (
        <div className="mt-6 flex justify-end">
          <button 
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            onClick={() => alert('Esta funcionalidad desactivaría el tratamiento en una app real')}
          >
            Marcar como Inactivo
          </button>
        </div>
      )}
    </div>
  );
};

// Función para generar un tratamiento de ejemplo basado en un ID
function getMockTreatment(id: number): Treatment | null {
  const mockTreatments = [
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
      homework: 'Realizar ejercicios de estiramiento de espalda 3 veces al día. Aplicar compresas calientes durante 15 minutos antes de los ejercicios.',
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
      homework: 'Ejercicios de fortalecimiento de rodilla. Series de 15 repeticiones, 3 veces al día. Evitar impactos fuertes.',
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
      homework: 'Rehabilitación post-quirúrgica de hombro. Movimientos pendulares suaves y elongación progresiva según indicaciones.',
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
      homework: 'Tratamiento para dolor lumbar crónico. Ejercicios de core y estiramiento de isquiotibiales. Mantener buena postura durante el trabajo.',
      is_active: true
    }
  ];
  
  return mockTreatments.find(t => t.id === id) || null;
}

export default TreatmentDetailPage;