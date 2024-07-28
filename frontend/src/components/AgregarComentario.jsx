import React, { useState } from 'react';
import { agregarComentario } from '../services/comentario.service';
import { getUserByRut, getUsersByRole } from '../services/user.service'; // Nueva función para obtener usuario por RUT
import Navbar from '../components/navbar.jsx';
import '../styles/Generico.css';
import { showRutError } from '../helpers/swaHelper.js';

const AgregarComentario = () => {
  const [rutAsignado, setRutAsignado] = useState('');
  const [comentario, setComentario] = useState('');
  const [empleado, setEmpleado] = useState(null);
  const [error, setError] = useState(null);

  const handleBuscarEmpleado = async () => {
    try {
      console.log('Buscando empleado con RUT:', rutAsignado);
      const empleadoEncontrado = await getUserByRut(rutAsignado);
      console.log('Empleado encontrado:', empleadoEncontrado);
      if (empleadoEncontrado) {
        setEmpleado(empleadoEncontrado);
        const comentariosEmpleado = await obtenerComentariosPorRut(rutAsignado);
        console.log('Comentarios encontrados:', comentariosEmpleado);
        setComentarios(comentariosEmpleado);
        setError('');
      } else {
        setEmpleado(null);
        setComentarios([]);
        setError('Empleado no encontrado o no tiene rol de empleado');
      }
    } catch (error) {
      console.log('Error al obtener empleado:', error);
      setEmpleado(null);
      setComentarios([]);
      setError('Error al obtener empleado');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    console.log('Enviando comentario:', { rutAsignado, comentario });

    if (!rutAsignado) {
      await showRutError();
      return;
    }

    if (!comentario) {
      setError('El comentario no puede estar vacío');
      return;
    }

    try {
      const response = await agregarComentario({ rutAsignado, comentario });
      console.log('Comentario agregado:', response);
      alert('Comentario agregado con éxito');
      setRutAsignado('');
      setComentario('');
      setEmpleado(null);
    } catch (error) {
      console.log('Error al agregar comentario:', error);
      setError('Error al agregar comentario');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ margin: 'auto', padding: '20px', width: '100%', maxWidth: '600px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <div className="form-container">
          <h2>Agregar Comentario</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>RUT empleado</label>
              <input
                type="text"
                value={rutAsignado}
                onChange={(e) => setRutAsignado(e.target.value)}
                required
              />
              <button type="button" onClick={handleBuscarEmpleado} className="btn btn-secondary">Buscar Empleado</button>
            </div>
            {empleado && (
              <div className="form-group">
              <p><strong>Nombre:</strong> {empleado.username}</p>
              <p><strong>Email:</strong> {empleado.email}</p>
              <p><strong>Rol:</strong> {empleado.roles.map(role => role.name).join(', ')}</p>
            </div>
            )}
            <div className="form-group">
              <label>Comentario</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Agregar Comentario</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarComentario;
