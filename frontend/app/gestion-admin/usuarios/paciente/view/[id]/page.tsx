'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface pacienteInterface {
  foto: string;
  dni: string;
  telefono: string;
  codigoPostal: string;
  fechaNacimiento: string;
  genero: string;
  estadoCuenta: string;
}

export default function verPaciente() {
  const [paciente, setPaciente] = useState<pacienteInterface | null>(null);
  
  useEffect(() => {
    // TODO: poner url
    axios.get('',
    ).then(response => {
        setPaciente(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/usuarios/paciente"><button className="btn-admin">Volver</button></a>
        <h1>Ver paciente</h1>
      </div>
      <div className="terminos-container">
        {paciente && <>
          <p>{paciente.dni}</p>
          <p>{paciente.phone_number}</p>
          <p>{paciente.postal_code}</p>
          <p>{paciente.account_status}</p>
          <p>{paciente.gender}</p>
          <p>{paciente.birth_date}</p>
        </>
        }

        {!paciente && <h1>Paciente no encontrado</h1>} 
      </div>

    </>
  );
}
