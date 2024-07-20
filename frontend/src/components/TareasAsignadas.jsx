import React, { useEffect, useState } from 'react';
import { getTareasAsignadas } from '../services/tareaRealizada.service.js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TareasAsignadas = () => {

  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]);
  const [error, setError] = useState(null);
  const rutUsuario = '20829012-6'; // Ajusta esto según tu contexto


  const fetchTareas = async () => {
   
    try {
      const response = await getTareasAsignadas();
      console.log(response);
    //   if (Array.isArray(response)) {
    //     setTareas(response);
    //   } else {
    //     console.error('La respuesta de la API no es una matriz:', response);
    //     setError('La respuesta de la API no es válida');
    //     setTareas([]);
    //   }
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Tareas Asignadas</h1>
      {tareas.length === 0 ? (
        <p>No hay tareas asignadas.</p>
      ) : (
        <ul>
          {tareas.map((tarea) => (
            <li key={tarea._id}>
              {tarea.descripcionTarea}
              <button onClick={() => handleResponderTarea(tarea._id)}>Responder Tarea</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TareasAsignadas;
