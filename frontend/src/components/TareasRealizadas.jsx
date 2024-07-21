import React, { useEffect, useState } from "react";
import {
  getTareasRealizadas,
  getTareasCompletadas,
  getTareasIncompletas,
  getTareasNoRealizadas,
} from "../services/tareaRealizada.service.js";
import Navbar from "../components/Navbar";
import "../styles/TareasRealizadas.css";

const TareasRealizadas = () => {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  const rutUsuario = "20829012-6"; // Ajusta esto según tu contexto

  const fetchTareas = async (filtro) => {
    try {
      let response;
      switch (filtro) {
        case "completadas":
          response = await getTareasCompletadas(rutUsuario);
          break;
        case "incompletas":
          response = await getTareasIncompletas(rutUsuario);
          break;
        case "noRealizadas":
          response = await getTareasNoRealizadas(rutUsuario);
          break;
        default:
          response = await getTareasRealizadas(rutUsuario);
          break;
      }
      console.log(response);
      if (Array.isArray(response)) {
        setTareas(response);
      } else {
        console.error("La respuesta de la API no es una matriz:", response);
        setError("La respuesta de la API no es válida");
        setTareas([]);
      }
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      setError("Error al obtener las tareas");
      setTareas([]);
    }
  };

  useEffect(() => {
    fetchTareas(filtro);
  }, [filtro]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="box">
        <h1 className="title is-2">Tareas Realizadas</h1>
        <div className="field">
          <label className="label" htmlFor="filtro">
            Filtrar por estado:
          </label>
          <div className="control">
            <div className="select">
              <select
                id="filtro"
                value={filtro}
                onChange={handleFiltroChange}
              >
                <option value="todas">Todas</option>
                <option value="completadas">Completadas</option>
                <option value="incompletas">Incompletas</option>
                <option value="noRealizadas">No Realizadas</option>
              </select>
            </div>
          </div>
        </div>
        {error && <p className="help is-danger">Error: {error}</p>}
        {tareas.length === 0 ? (
          <p>No hay tareas para mostrar.</p>
        ) : (
          <ul>
            {tareas.map((tarea) => (
              <li key={tarea.idTarea}>
                {tarea.descripcionTarea}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TareasRealizadas;

