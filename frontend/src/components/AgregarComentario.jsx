import React, { useState } from 'react';
import { agregarComentario } from '../services/comentario.service';
import { getUserByRut } from '../services/user.service'; // Nueva función para obtener usuario por RUT
import Navbar from '../components/navbar.jsx';
import '../styles/Generico.css';
import { showRutError, showCommentSuccess, showUserNotFoundError, showFetchUserError, showGeneralCommentError } from '../helpers/swaHelper.js';

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
        setError('');
      } else {
        setEmpleado(null);
        await showUserNotFoundError();
      }
    } catch (error) {
      console.log('Error al obtener empleado:', error);
      setEmpleado(null);
      await showFetchUserError();
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
      await message
      return;
    }

    try {
      const response = await agregarComentario({ rutAsignado, comentario });
      console.log('Comentario agregado:', response);
      await showCommentSuccess();
      setRutAsignado('');
      setComentario('');
      setEmpleado(null);
    } catch (error) {
      console.log('Error al agregar comentario:', error);
      await showGeneralCommentError();
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '250px', 
    marginTop: '64px', // Ajustar para la altura de la navbar
  };

  const BoxStyle = {
    alignItems: 'center',
    paddingTop: '64px', 
    width: '700px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
    position: 'relative', 
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={BoxStyle}>
        <h2 className="title">Agregar Comentario</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RUT empleado</label>
            <input
              type="text"
              placeholder="Ejemplo: 12345678-9"
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
              className="form-control comment-textarea"
            />
          </div>
          <button type="submit" className="btn btn-primary">Agregar Comentario</button>
        </form>
      </div>
    </div>
  );
};

export default AgregarComentario;
