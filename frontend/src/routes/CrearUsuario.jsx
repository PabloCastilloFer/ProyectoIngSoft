import React, { useState } from 'react';
import { crearUsuario } from '../services/user.service';
import '../styles/Generico.css'; // Asegúrate de tener estilos para los formularios

const CrearUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(''); // 'admin', 'supervisor', 'empleado'
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Verificar que todos los campos están completos
    if (!nombre || !email || !password || !rol) {
      setError('Todos los campos son obligatorios');
      return;
    }

    console.log("Datos enviados al backend:", { nombre, email, password, rol }); // Verificar datos enviados

    const response = await crearUsuario({ nombre, email, password, rol });

    console.log("Respuesta del backend:", response); // Verificar respuesta del backend

    if (response.status === 201) {
      alert('Usuario creado con éxito');
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('');
    } else {
      setError('Error al crear el usuario: ' + response.data?.message || response.error);
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Usuario</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="empleado">Empleado</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear Usuario</button>
      </form>
    </div>
  );
};

export default CrearUsuario;
