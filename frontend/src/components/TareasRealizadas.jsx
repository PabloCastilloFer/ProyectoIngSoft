import 'bulma/css/bulma.min.css';
import React, { useEffect, useState } from 'react';
import {
  getTareasRealizadas,
  getTareasCompletadas,
  getTareasIncompletas,
  getTareasNoRealizadas,
} from '../services/tareaRealizada.service.js';
import axios from 'axios';


import Navbar from '../components/navbar';
import '../styles/Generico.css';  // Importa los estilos
import { formToJSON } from 'axios';

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
    fetchData();
}, []);

  const fetchData = () => {
    axios.get('/tarea')
        .then((response) => {
            setTareas(response.data);
            console.log( response.data);
        })
        .catch((error) => {
            console.error('Error al obtener las tareas:', error);
        });
};

  useEffect(() => {
    console.log('Fetching tasks with filter:', filtro);
    console.log('RUT Usuario:', rutUsuario);
    fetchTareas(filtro);
  }, [filtro]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const containerStyle = {
    display: 'flex',
    marginRight: '300px',
    marginTop: '64px', // Ajustar para la altura de la navbar
    justifyContent: 'center',
    alignItems: 'center',
  };

  const BoxStyle = {
    alignItems: 'center',
    paddingTop: '64px', // Ajustar para la altura de la navbar
    width: '800px',
    padding: '1rem',
    borderRadius: '8px',
    textAlign: 'left',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  };

  const BoxStyle2 = {
    alignItems: 'center',
    paddingTop: '10px', // Ajustar para la altura de la navbar
    padding: '1rem',
    borderRadius: '10px',
    textAlign: 'left',
    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={BoxStyle}>
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
            <div key={`${tarea.idTarea}-${index}`} style={BoxStyle2}>
              <h2 className="title is-4">{tarea.nombreTarea}</h2>
              <p><strong>Tipo:</strong> {tarea.tipoTarea}</p>
              <p><strong>Descripción:</strong> {tarea.descripcionTarea}</p>
              <p><strong>Estado:</strong> {tarea.estadoTarea}</p>
              <p><strong>ID:</strong> {tarea.idTarea}</p>
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
