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
  const [error, setError] = useState(false);
  const [filtro, setFiltro] = useState('todas');

  const user = JSON.parse(localStorage.getItem('user'));
  const rutUsuario = user?.rut;

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

      if (Array.isArray(response)) {
        const filteredTareas = response.filter(tarea => tarea.tarea); // Filtra tareas que tienen información
        setTareas(filteredTareas);
        setError(false);
      } else {
        setError(true);
        setTareas([]);
      }
    } catch (error) {
      setError(true);
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
    <div style={{ display: 'flex', marginRight: '250px', marginTop: '64px', justifyContent: 'center', alignItems: 'center' }}>
      <Navbar />
      <div style={{ alignItems: 'center', paddingTop: '64px', width: '800px', padding: '1rem', borderRadius: '8px', textAlign: 'left', boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
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
        {tareas.length === 0 && (
          <p>No hay tareas para mostrar.</p>
        )}
        {tareas.map((tarea, index) => (
          <div key={`${tarea.id}-${index}`} className="task-box">
            <h2 className="title is-4">{tarea.tarea?.nombreTarea || 'Nombre no disponible'}</h2>
            <p><strong>Tipo:</strong> {tarea.tarea?.tipoTarea || 'Tipo no disponible'}</p>
            <p><strong>Descripción:</strong> {tarea.tarea?.descripcionTarea || 'Descripción no disponible'}</p>
            <p><strong>Estado:</strong> {tarea.estado}</p>
            <p><strong>Fecha de creación:</strong> {tarea.fechaCreacion ? new Date(tarea.fechaCreacion).toLocaleString() : 'Fecha no disponible'}</p>
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
        ))}
      </div>
    </div>
  );
};

export default TareasRealizadas;
