import 'bulma/css/bulma.min.css';
import React, { useEffect, useState } from 'react';
import { getTareasAsignadas } from '../services/tareaRealizada.service.js';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.jsx';
import '../styles/TareasAsignadas.css';  // Importa los estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTasks } from '@fortawesome/free-solid-svg-icons';

const TareasAsignadas = () => {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el campo de búsqueda
  const [filtroEstado, setFiltroEstado] = useState({
    asignada: true,
    entregada: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [tareasPerPage] = useState(5);

  const user = JSON.parse(localStorage.getItem('user'));
  const rutUsuario = user.rut;

  const fetchTareas = async () => {
    try {
      const response = await getTareasAsignadas(rutUsuario);
      if (response.status === 404) {
        setError(response.message);
        setTareas([]);
      } else if (Array.isArray(response)) {
        setTareas(response);
        setError(null);
      } else {
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

  const handleFiltroEstadoChange = (e) => {
    const { name, checked } = e.target;
    setFiltroEstado((prevFiltroEstado) => ({
      ...prevFiltroEstado,
      [name]: checked
    }));
  };

  // Filtrar tareas según el término de búsqueda y el estado
  const filteredTareas = tareas.filter(tarea => 
    tarea.nombreTarea.toLowerCase().includes(searchQuery.toLowerCase()) &&
    filtroEstado[tarea.estadoTarea.toLowerCase().replace(' ', '')]
  );

  const indexOfLastTarea = currentPage * tareasPerPage;
  const indexOfFirstTarea = indexOfLastTarea - tareasPerPage;
  const currentTareas = filteredTareas.slice(indexOfFirstTarea, indexOfLastTarea);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-content">
      <Navbar />
      <div className="main-content">
        <div className="box">
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
          <div className="field">
            <label className="label">Filtrar por estado:</label>
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="asignada"
                  checked={filtroEstado.asignada}
                  onChange={handleFiltroEstadoChange}
                />
                Asignada
              </label>
              <label className="checkbox" style={{marginLeft: '10px'}}>
                <input
                  type="checkbox"
                  name="entregada"
                  checked={filtroEstado.entregada}
                  onChange={handleFiltroEstadoChange}
                />
                Entregada
              </label>
            </div>
          </div>
          {error ? (
            <p>{error}</p>
          ) : currentTareas.length === 0 ? (
            <p>No hay tareas asignadas.</p>
          ) : (
            currentTareas.map((tarea) => (
              <div key={tarea.idTarea} className="task-box">
                <h2 className="title is-4">{tarea.nombreTarea}</h2>
                <p><strong>Tipo:</strong> {tarea.tipoTarea}</p>
                <p><strong>Descripción:</strong> {tarea.descripcionTarea}</p>
                <p><strong>Estado:</strong> {tarea.estadoTarea}</p>
                <p><strong>Inicio:</strong> {new Date(tarea.inicio).toLocaleString()}</p>
                <p><strong>Fin:</strong> {new Date(tarea.fin).toLocaleString()}</p>
                <p><strong>Supervisor:</strong> {tarea.supervisorNombre} </p> {/* Mostrar nombre y correo del supervisor */}
                <div>
                  <p><strong>Archivo adjunto:</strong></p>
                  {tarea.archivo ? (
                    <div className="download-container">
                      <span>{tarea.archivo}</span>
                      <a 
                        href={tarea.archivo} 
                        className="button is-link is-small ml-2" 
                        download
                      >
                        <FontAwesomeIcon icon={faDownload} /> DESCARGAR
                      </a>
                    </div>
                  ) : (
                    <span>No hay archivo adjunto</span>
                  )}
                </div>
                <div className="buttons">
                  <button 
                    className="button is-primary" 
                    onClick={() => handleResponderTarea(tarea.idTarea)}
                  >
                    <FontAwesomeIcon icon={faTasks} /> RESPONDER TAREA
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="pagination is-centered mt-4">
            <ul className="pagination-list">
              {Array.from({ length: Math.ceil(filteredTareas.length / tareasPerPage) }, (_, index) => (
                <li key={index}>
                  <a
                    className={`pagination-link ${index + 1 === currentPage ? 'is-current' : ''}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TareasAsignadas;
