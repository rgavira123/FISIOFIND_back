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

interface PhysiotherapistInterface {
  id: number;
  user: UserInterface;
  gender: string;
  autonomic_community: string;
  birth_date: string;
  collegiate_number: string;
  specializations: number[];
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
          color: '#d32f2f',  // Color rojo para resaltar el título
          fontSize: '18px',   // Tamaño de fuente mayor para destacar
          fontWeight: 'bold'  // Negrita para mayor énfasis
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

export default function GestionarFisioterapeutas() {
  const [isClient, setIsClient] = useState(false);
  const [physios, setPhysios] = useState<PhysiotherapistInterface[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Función para obtener la lista de fisioterapeutas
  const fetchPhysios = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${getApiBaseUrl()}/api/app_user/admin/physio/list/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        .then((response) => {
          const physioList = response.data.physioterapists.map((item: any) => ({
            id: item.physioterapist.id,
            user: item.physioterapist.user,
            gender: item.physioterapist.gender,
            autonomic_community: item.physioterapist.autonomic_community,
            birth_date: item.physioterapist.birth_date,
            collegiate_number: item.physioterapist.collegiate_number,
            specializations: item.physioterapist.specializations,
          }));
          setPhysios(physioList);
        })
        .catch((error) => {
          console.error("Error al obtener fisioterapeutas:", error);
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
            else fetchPhysios();
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
          fetchPhysios(); // Recarga la lista
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
          {}, // Si no necesitas enviar cuerpo, puedes dejarlo vacío
          {
            headers: {
              Authorization: `Bearer ${token}`, // Asegúrate de que el token esté aquí
            },
          }
        )
        .then((response) => {
          console.log("Cuenta Eliminada:", response.data);
          fetchPhysios(); // Recarga la lista
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
        <a href="/admin-management/"><button className="btn-admin">Volver</button></a>
        <h1>Página de administración de fisioterapeutas</h1>
      </div>

      <div className="terminos-container">
        <a href="/admin-management/users/physios/create/">
          <button className="btn-admin">Crear</button>
        </a>

        <div>
          {physios &&
            physios.map((physio) => (
              <div key={physio.id} className="termino-list-view">
                <p>Nombre de usuario: {physio.user.username}</p>
                <p>Nombre: {physio.user.first_name}</p>
                <p>Apellidos: {physio.user.last_name}</p>
                <p>Género: {physio.gender}</p>
                <p>Comunidad Autónoma: {physio.autonomic_community}</p>
                <p>Número de colegiado: {physio.collegiate_number}</p>

                <a href={`/admin-management/users/physios/view/${physio.id}`}>
                  <button className="btn-admin-green">Ver</button>
                </a>

                {/* ✅ Botón de cambiar estado */}
                {physio.user.account_status !== "REMOVED" && (
                <button
                  className="btn-admin-yellow"
                  onClick={() => handleAccountStatusUpdate(physio.user.user_id, physio.user.account_status)}
                >
                  {physio.user.account_status === "ACTIVE" ? "Activo" : "Suspendido"}
                </button>)}

                <button
                  className="btn-admin-red"
                  onClick={() => openModal(physio.user.user_id)} // Abre el modal
                >
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
