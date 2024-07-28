import React, { useEffect, useState } from 'react';
import {
  getTareasRealizadas,
  getTareasCompletadas,
  getTareasIncompletas,
  getTareasNoRealizadas,
} from '../services/tareaRealizada.service.js';
import Navbar from '../components/navbar';
import '../styles/Generico.css';  // Importa los estilos
import '../styles/TareasRealizadas.css'; // Importa los estilos específicos

const TareasRealizadas = () => {
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  const user = JSON.parse(localStorage.getItem('user'));
  const rutUsuario = user?.rut; // Obtén el rut del usuario desde el localStorage

  const fetchTareas = async (filtro) => {
    try {
      let response;
      switch (filtro) {
        case 'completadas':
          response = await getTareasCompletadas(rutUsuario);
          break;
        case 'incompletas':
          response = await getTareasIncompletas(rutUsuario);
          break;
        case 'noRealizadas':
          response = await getTareasNoRealizadas(rutUsuario);
          break;
        default:
          response = await getTareasRealizadas(rutUsuario);
          break;
      }
      console.log('Response from API:', response);
      if (Array.isArray(response)) {
        setTareas(response);
        setError(null); // Limpiar cualquier error previo
        console.log('Tasks set in state:', response);
      } else {
        console.error('La respuesta de la API no es una matriz:', response);
        setError('La respuesta de la API no es válida');
        setTareas([]);
      }
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      setError('Error al obtener las tareas');
      setTareas([]);
    }
  };

  useEffect(() => {
    console.log('Fetching tasks with filter:', filtro);
    console.log('RUT Usuario:', rutUsuario);
    fetchTareas(filtro);
  }, [filtro]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <div className="container">
      <Navbar />
      <div className="box">
        <div className="has-text-centered">
          <h1 className="title is-2">Tareas Realizadas</h1>
        </div>
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
          tareas.map((tarea, index) => (
            <div key={`${tarea.id}-${index}`} className="task-box">
              <h2 className="title is-4">{tarea.tarea?.nombreTarea || 'Nombre no disponible'}</h2>
              <p><strong>Tipo:</strong> {tarea.tarea?.tipoTarea || 'Tipo no disponible'}</p>
              <p><strong>Descripción:</strong> {tarea.tarea?.descripcionTarea || 'Descripción no disponible'}</p>
              <p><strong>Estado:</strong> {tarea.estado}</p>
              <p><strong>Inicio:</strong> {tarea.ticket?.inicio ? new Date(tarea.ticket.inicio).toLocaleString() : 'Fecha no disponible'}</p>
              <p><strong>Fin:</strong> {tarea.ticket?.fin ? new Date(tarea.ticket.fin).toLocaleString() : 'Fecha no disponible'}</p>
              <div>
                <strong>Archivo adjunto:</strong> {tarea.archivoAdjunto ? (
                  <div className="download-container">
                    <span>{tarea.archivoAdjunto}</span>
                    <a 
                      href={tarea.archivoAdjunto} 
                      className="button is-link is-small ml-2" 
                      download
                    >
                      DESCARGAR
                    </a>
                  </div>
                ) : 'No hay archivo adjunto'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TareasRealizadas;
