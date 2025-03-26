'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface pacienteInterface {
  user: string,
  gender: string,
  birth_date: string,
}

const account_status = {
  'ACTIVE':'Activa',
  'BANNED':'Baneada',
  'REMOVED':'Eliminada'
}

export default function VerPaciente() {
  const id = get_id_from_url()

  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (token) {
        axios
          .get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((response) => {
            const role = response.data.user_role;
            console.log(role)
            if (role != "admin") {
              //location.href = "..";
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            //location.href = "..";
          });
      } else {
        //location.href = "..";
      }
    }
  }, [isClient, token]);
  
  const [paciente, setPaciente] = useState<pacienteInterface | null>(null);
  
  useEffect(() => {
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/patient/list/`+id+'/',{
      headers: {
        Authorization: "Bearer " + token,
      },
    
    }).then(response => {
      console.log(response.data)
        setPaciente(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [token]);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/users/patients/"><button className="btn-admin">Volver</button></a>
        <h1>Ver paciente</h1>
      </div>
      <div className="terminos-container">
        {paciente && <>
          <img 
              src={paciente.user.photo} 
              alt="Profile" 
              className="w-[10rem] h-[10rem] object-cover"
          />
          <p>Id: {paciente.id}</p>
          <p>Nombre de usuario: {paciente.user.username}</p>
          <p>Nombre: {paciente.user.first_name}</p>
          <p>Apellidos: {paciente.user.last_name}</p>
          <p>DNI: {paciente.user.dni}</p>
          <p>Género: {paciente.gender}</p>
          <p>Email: {paciente.user.email}</p>
          <p>Número de teléfono: {paciente.user.phone_number}</p>
          <p>Fecha de nacimiento: {print_time(paciente.birth_date)}</p>
          <p>Código postal: {paciente.user.postal_code}</p>
          <p>Estado de cuenta: {account_status[paciente.user.account_status]}</p>
        </>
        }

        {!paciente && <h1>Paciente no encontrado</h1>} 
      </div>

    </>
  );
}
