'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export default function editarCitas() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [esOnline, setEsOnline] = useState(true);
  const [servicios, setServicios] = useState('{"type": "Rehabilitación", "duration": 45}');
  const [alternativas, setAlternativas] = useState('{}');
  const [paciente, setPaciente] = useState("0");
  const [fisio, setFisio] = useState("0");
  const [estado, setEstado] = useState("finished")
  
  const [errorMessage, setErrorMessage] = useState("");
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
            if (role != "admin") {
              location.href = "..";
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            location.href = "..";
          });
      } else {
        location.href = "..";
      }
    }
  }, [isClient, token]);

  function handleSubmit(event) {
    event.preventDefault();
    
    let service = {}
    try {
      service = JSON.parse(servicios);
    } catch (error) {
      setErrorMessage("JSON de servicios inválido")
      return
    }

    axios.post(`${getApiBaseUrl()}/api/appointment/admin/create/`,{
      start_time: fechaInicio,
      end_time: fechaFinal,
      is_online: esOnline,
      service: service,
      patient: paciente,
      physiotherapist: fisio,
      status: estado,
      alternatives: alternativas
    }, {
      headers : {
        "Authorization": "Bearer "+token
      }
    }).then( () => {
        location.href="/admin-management/appointments/"
      })
      .catch(error => {
        if (error.response && error.response.data.non_field_errors) {
          setErrorMessage(error.response.data.non_field_errors[0])
        } else if (error.response && error.response.status == 400) {
          let container = ''
          for (const [_, error_msg] of Object.entries(error.response.data)) {
            container += error_msg 
          }
          setErrorMessage(container)
        }else {
          console.error("Error fetching data:", error);
        }
    });
  }

  const [pacientesFetched, setPacientesFetched] = useState([]);
  function searchPaciente(query) {
    if (query.length < 3) {
      return
    }
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/patient/list/search/`+query+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        console.log(response.data)
        setPacientesFetched(response.data)
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }

  const [fisiosFetched, setFisiosFetched] = useState([]);
  function searcFisio(query) {
    if (query.length < 3) {
      return
    }
    axios.get(`${getApiBaseUrl()}/api/app_user/admin/physio/list/search/`+query+'/',{
      headers : {
        "Authorization": "Bearer "+token
      }
    }
    ).then(response => {
        setFisiosFetched(response.data)
      })
      .catch(error => {
        console.log("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="admin-header">
        <h1>Crear cita</h1>
      </div>
      <div className="terminos-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fecha-inicio">Fecha y hora inicio: </label>
            <input required type="datetime-local" id="fecha-inicio" onChange={fechaIn => setFechaInicio(fechaIn.target.value)}/>
          </div>
          <div>
            <label htmlFor="fecha-final">Ficha y hora final: </label>
            <input required type="datetime-local" id="fecha-final" onChange={fechaFin => setFechaFinal(fechaFin.target.value)}/>
          </div> 

          <div>
            <label htmlFor="es-online">¿Es la cita online?: </label>
            <select name="es-online" id="es-online" onChange={online => setEsOnline(online == "true" ? true : false)} >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="paciente">Email/Nombre/DNI paciente: </label>
            <input required type="text" id="paciente"  onChange={paciente => {searchPaciente(paciente.target.value)}} />
            <select
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Seleccionar paciente...</option>
              {pacientesFetched && pacientesFetched.map((patient: any) => (
                <option key={patient.id} value={patient.id}>
                  {patient.user.first_name} {patient.user.last_name} ({patient.user.dni}) ({patient.user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fisio">Email/Nombre/DNI fisioterapeuta: </label>
            <input required type="text" id="fisio"  onChange={fisio => {searcFisio(fisio.target.value)}} />
            <select
              value={fisio}
              onChange={(e) => setFisio(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Seleccionar fisioterapeuta...</option>
              {fisiosFetched && fisiosFetched.map((physio: any) => (
                <option key={physio.id} value={physio.id}>
                  {physio.user.first_name} {physio.user.last_name} ({physio.user.dni}) ({physio.user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="json-service">
            <label htmlFor="servicios">Servicios:</label>
            <textarea  value={servicios} required id="servicios" onChange={serv => setServicios(serv.target.value)}></textarea>
          </div>

          <div>
            <label htmlFor="estado-cita">Estado de la cita: </label>
            <select name="estado-cita" id="estado-cita" onChange={estado_cita => setEstado(estado_cita.target.value)} >
              <option value="finished">Finalizada</option>
              <option value="confirmed">Confirmada</option>
              <option value="canceled">Cancelada</option>
              <option value="booked">Reservada</option>
            </select>
          </div>

          <div className="json-service">
            <label htmlFor="alternativas">Alternativas:</label>
            <textarea  value={alternativas} required id="alternativas" onChange={altr => setAlternativas(altr.target.value)}></textarea>
          </div>

          {errorMessage && <p className="text-red-500 text-wrap">*{errorMessage}</p>}
          <input type="submit" value="Submit" className="btn-admin" />
        </form>
      </div>

    </>
  );
}
