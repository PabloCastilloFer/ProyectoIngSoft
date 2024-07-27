import 'bulma/css/bulma.min.css';
import React, { useEffect, useState } from 'react';
import { getTareasAsignadas } from '../services/tareaRealizada.service.js';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.jsx';
import '../styles/TareasAsignadas.css';  // Importa los estilos

const TareasAsignadas = () => {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el campo de búsqueda

  const user = JSON.parse(localStorage.getItem('user'));
  const rutUsuario = user.rut;

  const fetchTareas = async () => {
    try {
      const response = await getTareasAsignadas(rutUsuario);
      console.log(response);
      if (Array.isArray(response)) {
        setTareas(response);
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
    fetchTareas();
  }, []);

  const handleResponderTarea = (tareaId) => {
    navigate(`/responder-tarea/${tareaId}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrar tareas según el término de búsqueda
  const filteredTareas = tareas.filter(tarea => 
    tarea.nombreTarea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  const containerStyle = {
    display: 'flex',
    marginRight:'300px',
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
          <h1 className="title is-2">Tareas Asignadas</h1>
        </div>
        <div className="field">
          <label className="label" htmlFor="search">Buscar Tareas:</label>
          <div className="control">
            <input
              id="search"
              type="text"
              className="input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar por nombre de tarea..."
            />
          </div>
        </div>
        {filteredTareas.length === 0 ? (
          <p>No hay tareas asignadas.</p>
        ) : (
          filteredTareas.map((tarea) => (
            <div key={tarea.idTarea} style={BoxStyle2}>
              <h2 className="title is-4">{tarea.nombreTarea}</h2>
              <p><strong>Tipo:</strong> {tarea.tipoTarea}</p>
              <p><strong>Descripción:</strong> {tarea.descripcionTarea}</p>
              <p><strong>Estado:</strong> {tarea.estadoTarea}</p>
              <p><strong>ID:</strong> {tarea.idTarea}</p>
              <p>
                <strong>Archivo adjunto:</strong> {tarea.archivo ? (
                  <div className="download-container">
                    <span>{tarea.archivo}</span>
                    <a 
                      href={tarea.archivo} 
                      className="button is-link is-small ml-2" 
                      download
                    >
                      DESCARGAR
                    </a>
                  </div>
                ) : 'No hay archivo adjunto'}
              </p>
              <div className="buttons">
                <button 
                  className="button is-primary" 
                  onClick={() => handleResponderTarea(tarea.idTarea)}
                >
                  <span>RESPONDER TAREA</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TareasAsignadas;
