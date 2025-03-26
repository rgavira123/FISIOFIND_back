'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

interface UserInterface {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  dni: string;
  phone_number: string;
  postal_code: string;
  account_status: string;
}

interface PatientInterface {
  id: number;
  user: UserInterface;
  gender: string;
  birth_date: string;
}

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{
          marginTop: 0,
          color: '#d32f2f',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {title}
        </h3>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function GestionarPacientes() {
  const [isClient, setIsClient] = useState(false);
  const [pacientes, setPacientes] = useState<PatientInterface[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Función para obtener la lista de pacientes
  const fetchPatients = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/admin/patient/list/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then((response) => {
          const patientList = response.data.patients.map((item: any) => ({
            id: item.patient.id,
            user: item.patient.user,
            gender: item.patient.gender,
            birth_date: item.patient.birth_date,
          }));
          setPacientes(patientList);
        })
        .catch((error) => {
          console.error("Error fetching patients:", error);
        });
    }
  };

  // ✅ Comprobación de rol de admin
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          .then((response) => {
            if (response.data.user_role !== "admin") location.href = "..";
            else fetchPatients();
          })
          .catch((error) => {
            console.error("Error verificando el rol:", error);
            location.href = "..";
          });
      } else {
        location.href = "..";
      }
    }
  }, [isClient]);

  // ✅ Cambiar el estado de la cuenta
  const handleAccountStatusUpdate = (userId: number, currentStatus: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
      axios.patch(`${getApiBaseUrl()}/api/app_user/admin/update-account-status/${userId}/`,
        { account_status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
        .then((response) => {
          console.log("Estado de cuenta actualizado:", response.data);
          fetchPatients(); // Recarga la lista
        })
        .catch((error) => {
          console.error("Error al actualizar el estado de la cuenta:", error);
        });
    }
  };

  const handleAccountStatusDelete = (userId: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .patch(
          `${getApiBaseUrl()}/api/app_user/admin/remove-user/${userId}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Cuenta Eliminada:", response.data);
          fetchPatients(); // Recarga la lista
          setShowModal(false); // Cierra el modal después de eliminar
        })
        .catch((error) => {
          console.error("Error al eliminar el estado de la cuenta:", error);
        });
    }
  };

  const openModal = (userId: number) => {
    setUserIdToDelete(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserIdToDelete(null);
  };

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/">
          <button className="btn-admin">Volver</button>
        </a>
        <h1>Página de administración de pacientes</h1>
      </div>

      <div className="terminos-container">
        <a href="/admin-management/users/patients/create/">
          <button className="btn-admin">Crear</button>
        </a>

        <div>
          {pacientes &&
            pacientes.map((paciente, key) => (
              <div key={key} className="termino-list-view">
                <p>Id: {paciente.id}</p>
                <p>Nombre de usuario: {paciente.user.username}</p>
                <p>Nombre: {paciente.user.first_name}</p>
                <p>Apellidos: {paciente.user.last_name}</p>
                <p>Género: {paciente.gender}</p>
                <p>Fecha de nacimiento: {paciente.birth_date}</p>

                <a href={`/admin-management/users/patients/view/${paciente.id}`}>
                  <button className="btn-admin-green">Ver</button>
                </a>

                {/* ✅ Botón de cambiar estado */}
                {paciente.user.account_status !== "REMOVED" && (
                <button
                  className="btn-admin-yellow"
                  onClick={() => handleAccountStatusUpdate(paciente.user.user_id, paciente.user.account_status)}
                >
                  {paciente.user.account_status === "ACTIVE" ? "Activo" : "Suspendido"}
                </button>)}

                  <button className="btn-admin-red" onClick={() => openModal(paciente.user.user_id)}>
                    Eliminar
                  </button>
              </div>
            ))}
        </div>
      </div>

      {showModal && userIdToDelete !== null && (
        <ConfirmationModal
          title="¿Estás seguro de que deseas eliminar esta cuenta?"
          message="La cuenta no será borrada, para hacerlo se deberá realizar en la base de datos"
          onConfirm={() => handleAccountStatusDelete(userIdToDelete)}
          onCancel={closeModal}
        />
      )}
    </>
  );
}
