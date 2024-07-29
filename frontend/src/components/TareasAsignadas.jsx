import 'bulma/css/bulma.min.css';
import React, { useEffect, useState } from 'react';
import { getTareasAsignadas } from '../services/tareaRealizada.service.js';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar.jsx';
import '../styles/TareasAsignadas.css';  // Importa los estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTasks } from '@fortawesome/free-solid-svg-icons';
import { getArchive } from '../services/archive.service.js'; // Importa el servicio para manejar archivos

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
    tarea && tarea.nombreTarea && tarea.nombreTarea.toLowerCase().includes(searchQuery.toLowerCase()) &&
    filtroEstado[tarea.estadoTarea.toLowerCase().replace(' ', '')]
  );

  const indexOfLastTarea = currentPage * tareasPerPage;
  const indexOfFirstTarea = indexOfLastTarea - tareasPerPage;
  const currentTareas = filteredTareas.slice(indexOfFirstTarea, indexOfLastTarea);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleArchivo = async (url) => {
    try {
      const data = await getArchive(url);
      const extension = url.split('.').pop().split(/\#|\?/)[0];
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `archivo.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al manejar el archivo:', error.message);
    }
  };

  const getFileName = (url) => {
    return url.split('/').pop().split('#')[0].split('?')[0];
  };

  const containerStyle = {
    display: 'flex',
    marginRight:'250px',
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

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={BoxStyle}>
        <div>
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
                <p><strong>Supervisor:</strong> {tarea.supervisorNombre} ({tarea.supervisorEmail})</p>
                <p><strong>Fecha de Inicio:</strong> {new Date(tarea.inicio).toLocaleString()}</p>
                <p><strong>Fecha de Fin:</strong> {new Date(tarea.fin).toLocaleString()}</p>
                <div className="download-container">
                  <strong>Archivo adjunto:</strong>
                  {tarea.archivo ? (
                    <>
                      <span className="archivo-nombre">{getFileName(tarea.archivo)}</span>
                      <button 
                        className="button is-link is-small button-download" 
                        onClick={() => handleArchivo(tarea.archivo)}
                      >
                        <FontAwesomeIcon icon={faDownload} /> DESCARGAR
                      </button>
                    </>
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
