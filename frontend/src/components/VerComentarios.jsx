import React, { useState, useEffect } from 'react';
import { obtenerComentariosPorRut, eliminarComentario, actualizarComentario } from '../services/comentario.service';
import { getUserByRut } from '../services/user.service';
import Navbar from '../components/navbar.jsx';
import { showSuccess, showError, showConfirmDelete } from '../helpers/swaHelper.js';
import '../styles/Generico.css';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '250px', 
  marginTop: '64px', // Ajustar para la altura de la navbar
};

const boxStyle = {
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
const VerComentarios = () => {
  const [rutAsignado, setRutAsignado] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [empleado, setEmpleado] = useState(null);
  const [error, setError] = useState(null);

  const handleBuscarEmpleado = async () => {
    try {
      console.log('Buscando empleado con RUT:', rutAsignado);
      const empleadoEncontrado = await getUserByRut(rutAsignado);
      console.log('Empleado encontrado:', empleadoEncontrado);
      if (empleadoEncontrado) {
        setEmpleado(empleadoEncontrado);
        const response = await obtenerComentariosPorRut(rutAsignado);
        const comentariosEmpleado = response.data;
        console.log('Comentarios encontrados:', comentariosEmpleado);
        setComentarios(comentariosEmpleado);
        setError('');
      } else {
        setEmpleado(null);
        setComentarios([]);
        await showError('Empleado no encontrado o no tiene rol de empleado');
      }
    } catch (error) {
      console.log('Error al obtener empleado:', error);
      setEmpleado(null);
      setComentarios([]);
      await showError('Error al obtener empleado');
    }
  };

  const handleEliminar = async (id) => {
    const result = await showConfirmDelete();
    if (result.isConfirmed) {
      try {
        await eliminarComentario(id);
        setComentarios(comentarios.filter((comentario) => comentario._id !== id));
        await showSuccess('Comentario eliminado con éxito');
      } catch (error) {
        await showError('Error al eliminar comentario');
      }
    }
  };

  const handleEditar = (comentario) => {
    setComentarioSeleccionado(comentario);
    setNuevoComentario(comentario.comentario);
  };

  const handleActualizar = async () => {
    try {
      await actualizarComentario(comentarioSeleccionado._id, { comentario: nuevoComentario });
      const updatedComentarios = comentarios.map((comentario) =>
        comentario._id === comentarioSeleccionado._id
          ? { ...comentario, comentario: nuevoComentario }
          : comentario
      );
      setComentarios(updatedComentarios);
      setComentarioSeleccionado(null);
      setNuevoComentario('');
      await showSuccess('Comentario actualizado con éxito');
    } catch (error) {
      await showError('Error al actualizar comentario');
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={boxStyle}>
        <div>
          <h2 className="title">Ver Comentarios</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>RUT Empleado</label>
              <input
                type="text"
                value={rutAsignado}
                onChange={(e) => setRutAsignado(e.target.value)}
                className="form-control"
              />
              <button type="button" onClick={handleBuscarEmpleado} className="btn btn-primary">Buscar Empleado</button>
            </div>
            {empleado && (
              <div className="form-group">
                <h2 className="title">Información del Empleado</h2>
                <p><strong>Nombre:</strong> {empleado.username}</p>
                <p><strong>Email:</strong> {empleado.email}</p>
              </div>
            )}
            {comentarios.length > 0 ? (
              <div className="comments-section">
                <h3 className="title">Comentarios</h3>
                <div className="comments-header">
                  <div className="comment-column">Comentario</div>
                  <div className="actions-column">Acciones</div>
                </div>
                {comentarios.map((comentario) => (
                  <div key={comentario._id} className="comment-row">
                    <div className="comment-column">{comentario.comentario}</div>
                    <div className="actions-column">
                      <div className="button-containerfs">
                        <button className="buttonfs is-actualizar" onClick={() => handleEditar(comentario)}>Editar</button>
                        <button className="buttonfs is-eliminar" onClick={() => handleEliminar(comentario._id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay comentarios disponibles.</p>
            )}
            {comentarioSeleccionado && (
              <div className="modify-comment">
                <h3 className="title">Modificar Comentario</h3>
                <div className="form-group">
                  <label>Comentario</label>
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    required
                    className="form-control comment-textarea"
                  />
                </div>
                <button onClick={handleActualizar} className="buttonfs is-actualizar">
                  Actualizar Comentario
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerComentarios;