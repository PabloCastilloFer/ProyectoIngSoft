// frontend/src/components/VerModificarEliminarUsuario.jsx
import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../services/user.service';
import Navbar from '../components/navbar.jsx';
import { showSuccess, showError, showConfirmDelete } from '../helpers/swaHelper.js';
import '../styles/Generico.css';

const VerModificarEliminarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    username: '',
    email: '',
    roles: '',
    facultad: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await getUsers();
      setUsuarios(response.data);
    } catch (error) {
      setError('Error al obtener los usuarios');
    }
  };

  const handleEliminar = async (id) => {
    const result = await showConfirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
        await showSuccess('Usuario eliminado con éxito');
      } catch (error) {
        await showError('Error al eliminar usuario');
      }
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setUpdatedData({
      username: usuario.username,
      email: usuario.email,
      roles: usuario.roles[0].name,
      facultad: usuario.facultades[0].nombre
    });
  };

  const handleActualizar = async () => {
    try {
      await updateUser(usuarioSeleccionado._id, updatedData);
      const updatedUsuarios = usuarios.map((usuario) =>
        usuario._id === usuarioSeleccionado._id
          ? { ...usuario, ...updatedData }
          : usuario
      );
      setUsuarios(updatedUsuarios);
      setUsuarioSeleccionado(null);
      setUpdatedData({
        username: '',
        email: '',
        roles: '',
        facultad: ''
      });
      await showSuccess('Usuario actualizado con éxito');
    } catch (error) {
      await showError('Error al actualizar usuario');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div className="container">
        <h2 className="title">Usuarios</h2>
        {error && <p className="error">{error}</p>}
        {usuarios.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Facultad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.username}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.roles[0].name}</td>
                    <td>{usuario.facultades[0].nombre}</td>
                    <td>
                      <button className="btn btn-warning" onClick={() => handleEditar(usuario)}>Editar</button>
                      <button className="btn btn-danger" onClick={() => handleEliminar(usuario._id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay usuarios disponibles.</p>
        )}
        {usuarioSeleccionado && (
          <div className="form-container">
            <h3>Modificar Usuario</h3>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={updatedData.username}
                onChange={(e) => setUpdatedData({ ...updatedData, username: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={updatedData.email}
                onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <input
                type="text"
                value={updatedData.roles}
                onChange={(e) => setUpdatedData({ ...updatedData, roles: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Facultad</label>
              <input
                type="text"
                value={updatedData.facultad}
                onChange={(e) => setUpdatedData({ ...updatedData, facultad: e.target.value })}
                required
                className="form-control"
              />
            </div>
            <button onClick={handleActualizar} className="btn btn-primary">Actualizar Usuario</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerModificarEliminarUsuario;
