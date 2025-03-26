'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { get_id_from_url } from "@/app/admin-management/util";
import { getApiBaseUrl } from "@/utils/api";

interface fisioterapeutaInterface {
  foto: string;
  dni: string;
  telefono: string;
  codigoPostal: string;
  fechaNacimiento: string;
  genero: string;
  estadoCuenta: string;
  comunidadAutonoma: string;
}

const account_status = {
  'ACTIVE':'Activa',
  'BANNED':'Baneada',
  'REMOVED':'Eliminada'
}

export default function VerFisioterapeuta() {
  const [id,setId] = useState("")
  const [fisioterapeuta, setFisio] = useState<fisioterapeutaInterface | null>(null);
  
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setId(get_id_from_url())
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
  }, [id, isClient, token]);

  useEffect(() => {
    // TODO: poner url
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/physio/list/`+id+'/',{
      headers: {
        Authorization: "Bearer " + token,
      },
    }
    ).then(response => {
        console.log(response.data)
        setFisio(response.data);
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }, [token,id]);

  return (
    <>
      <div className="admin-header">
        <a href="/admin-management/users/physios/"><button className="btn-admin">Volver</button></a>
        <h1>Ver fisioterapeuta</h1>
      </div>
      <div className="terminos-container">
        {fisioterapeuta && <>
          <img 
              src={fisioterapeuta.user.photo} 
              alt="Profile" 
              className="w-[10rem] h-[10rem] object-cover"
          />
          <p>Id: {fisioterapeuta.id}</p>
          <p>DNI: {fisioterapeuta.dni}</p>
          <p>Número de teléfono: {fisioterapeuta.phone_number}</p>
          <p>Puntuación media: {fisioterapeuta.rating_avg}</p>
          <p>Código postal: {fisioterapeuta.postal_code}</p>
          <p>Estado de cuenta: {account_status[fisioterapeuta.account_status]}</p>
          <p>Género: {fisioterapeuta.gender}</p>
          <p>Fecha de nacimiento: {fisioterapeuta.birth_date}</p>
          <p>Comunidad autónoma: {fisioterapeuta.autonomic_community}</p>
          <p>Número de colegiado: {fisioterapeuta.collegiate_number}</p>
          <p>Especializaciones: {fisioterapeuta.specializations}</p>
          <p className="overflow-scroll">Bio: {fisioterapeuta.bio}</p>
          <p className="overflow-scroll">Horario: {JSON.stringify(fisioterapeuta.schedule)}</p>
          <p className="overflow-scroll">Servicios: {JSON.stringify(fisioterapeuta.services)}</p>
        </>
        }

        {!fisioterapeuta && <h1>Fisioterapeuta no encontrado</h1>} 
      </div>

    </>
  );
}
