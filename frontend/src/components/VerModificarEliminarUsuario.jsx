import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../services/user.service';
import { showSuccess, showError, showConfirmDelete } from '../helpers/swaHelper.js';
import Navbar from '../components/navbar.jsx';
import '../styles/Generico.css';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: '250px',
  marginTop: '64px',
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

const VerModificarEliminarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Nuevo estado para la contraseña
  const [rol, setRol] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        console.log('Response from getUsers:', response);
        if (response.state === 'Success') {
          console.log('Usuarios obtenidos:', response.data); // Verificar si los datos son correctos
          setUsuarios(response.data); // Acceder a response.data para obtener los usuarios
        } else {
          console.log('No se obtuvieron usuarios, estado:', response.state);
          setUsuarios([]);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setUsuarios([]);
        await showError('Error al obtener usuarios');
      }
    };

    fetchUsers();
  }, []);

  const handleEliminar = async (id) => {
    const result = await showConfirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        console.log('Usuario eliminado:', id);
        setUsuarios(usuarios.filter((usuario) => usuario._id !== id));
        await showSuccess('Usuario eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        await showError('Error al eliminar usuario');
      }
    }
  };

  const handleEditar = (usuario) => {
    console.log('Usuario seleccionado para editar:', usuario);
    setUsuarioSeleccionado(usuario);
    setUsername(usuario.username);
    setEmail(usuario.email);
    setPassword(''); // Inicializar la contraseña a vacío
    setRol(usuario.roles[0]);
  };

  const handleActualizar = async () => {
    try {
      const updatedUser = { username, email, roles: [rol] };
      if (password) {
        updatedUser.password = password; // Solo incluir la contraseña si se ha proporcionado
      }
      console.log('Datos para actualizar:', usuarioSeleccionado._id, updatedUser); // Verificar los datos
      await updateUser(usuarioSeleccionado._id, updatedUser);
      const updatedUsuarios = usuarios.map((usuario) =>
        usuario._id === usuarioSeleccionado._id ? { ...usuario, ...updatedUser } : usuario
      );
      setUsuarios(updatedUsuarios);
      setUsuarioSeleccionado(null);
      setUsername('');
      setEmail('');
      setPassword(''); // Restablecer la contraseña
      setRol('');
      console.log('Usuario actualizado:', updatedUser);
      await showSuccess('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      await showError('Error al actualizar usuario');
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={boxStyle}>
        <div>
          <h2 className="title">Ver Usuarios</h2>
          {error && <p className="error">{error}</p>}
          <div className="comments-section">
            <h3 className="title">Usuarios</h3>
            {usuarios.length > 0 ? (
              <div className="comments-header">
                <div className="comment-column">Usuario</div>
                <div className="actions-column">Acciones</div>
              </div>
            ) : (
              <p>No hay usuarios disponibles.</p>
            )}
            {usuarios.map((usuario) => (
              <div key={usuario._id} className="comment-row">
                <div className="comment-column">{usuario.username}</div>
                <div className="actions-column">
                  <div className="button-containerfs">
                    <button className="buttonfs is-actualizar" onClick={() => handleEditar(usuario)}>Editar</button>
                    <button className="buttonfs is-eliminar" onClick={() => handleEliminar(usuario._id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {usuarioSeleccionado && (
            <div className="modify-comment">
              <h3 className="title">Modificar Usuario</h3>
              <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="admin">Admin</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>
              <button onClick={handleActualizar} className="buttonfs is-actualizar">Actualizar Usuario</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerModificarEliminarUsuario;
