import React, { useState, useEffect } from 'react';
import { crearUsuario } from '../services/user.service';
import Navbar from '../components/Navbar.jsx';
import '../styles/Generico.css'; // Asegúrate de tener estilos para los formularios


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

const CrearUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(''); // 'admin', 'supervisor', 'empleado'
  const [facultad, setFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const facultadesFromStorage = JSON.parse(localStorage.getItem('facultades')) || [];
    setFacultades(facultadesFromStorage);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Verificar que todos los campos están completos
    if (!nombre || !email || !password || !rol || !facultad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    console.log("Datos enviados al backend:", { nombre, email, password, rol, facultad }); // Verificar datos enviados

    const response = await crearUsuario({ nombre, email, password, rol, facultad });

    console.log("Respuesta del backend:", response); // Verificar respuesta del backend

    if (response.status === 201) {
      alert('Usuario creado con éxito');
      setNombre('');
      setEmail('');
      setPassword('');
      setRol('');
      setFacultad('');
    } else {
      setError('Error al crear el usuario: ' + (response.data?.message || response.error));
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={boxStyle}>
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
            <div className="form-group">
              <label>Facultad</label>
              <select
                value={facultad}
                onChange={(e) => setFacultad(e.target.value)}
                required
              >
                <option value="">Seleccione una facultad</option>
                {facultades.map((facultad, index) => (
                  <option key={index} value={facultad.nombre}>{facultad.nombre}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Crear Usuario</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;

