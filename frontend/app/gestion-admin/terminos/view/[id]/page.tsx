'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { print_time, get_id_from_url } from "@/app/gestion-admin/util";


interface terminoInterface {
  content: string;
  version: string;
  updated_at: string;
  created_at: string;
}

export default function VerTermino() {
  const id = get_id_from_url()

  const [termino, setTermino] = useState<terminoInterface | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/terminos/list/'+id+'/'
    ).then(response => {
        setTermino(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="admin-header">
        <a href="/gestion-admin/terminos"><button className="btn-admin">Volver</button></a>
        <h1>Vista de término</h1>
      </div>
      <div className="terminos-container">
        {termino && <>
          <p>Versión: {termino.version} </p>
          <p>Editado en: {print_time(termino.updated_at)}</p>
          <p>Creado en: {print_time(termino.created_at)}</p>
          <p>{termino.content}</p>
          </>
        }
        {!termino && <h1>Término no encontrado</h1>
        }    
      </div>

    </>
  );
}
