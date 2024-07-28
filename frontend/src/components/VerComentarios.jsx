import React, { useState, useEffect } from 'react';
import { obtenerComentariosPorRut, eliminarComentario, actualizarComentario } from '../services/comentario.service';
import { getUserByRut } from '../services/user.service';
import Navbar from '../components/navbar.jsx';
import { showSuccess, showError, showConfirmDelete } from '../helpers/swaHelper.js';
import '../styles/Generico.css';

const containerStyle = {
  display: 'flex',
};

const boxStyle = {
  margin: 'auto',
  padding: '20px',
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#fff',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
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
        <div className="form-container">
          <h2>Ver Comentarios</h2>
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
                <h3>Información del Empleado</h3>
                <p><strong>Nombre:</strong> {empleado.username}</p>
                <p><strong>Email:</strong> {empleado.email}</p>
              </div>
            )}
            {comentarios.length > 0 ? (
              <div className="comments-section">
                <h3>Comentarios</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Comentario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comentarios.map((comentario) => (
                      <tr key={comentario._id}>
                        <td>{comentario.comentario}</td>
                        <td>
                          <button onClick={() => handleEditar(comentario)} className="btn btn-warning">Editar</button>
                          <button onClick={() => handleEliminar(comentario._id)} className="btn btn-danger">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay comentarios para este empleado.</p>
            )}
            {comentarioSeleccionado && (
              <div>
                <h3>Modificar Comentario</h3>
                <div className="form-group">
                  <label>Comentario</label>
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <button onClick={handleActualizar} className="btn btn-primary">Actualizar Comentario</button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerComentarios;
