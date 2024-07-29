import React, { useState, useEffect } from 'react';
import { crearUsuario } from '../services/user.service';
import Navbar from '../components/navbar.jsx';
import '../styles/Generico.css';
import {showUsernameError,showEmailError,showPasswordError,showPasswordLengthError,showRutError,showRutDuplicateError,showRoleError,showFacultyError,showAuthError} from '../helpers/swaHelper.js';

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

const CrearUsuario = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rut, setRut] = useState('');
  const [roles, setRoles] = useState('');
  const [facultad, setFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const facultadesFromStorage = JSON.parse(localStorage.getItem('facultades')) || [];
    setFacultades(facultadesFromStorage);
  }, []);

  const validarRut = (rut) => {
    const regex = /^[0-9]+[-|‐]{1}[0-9kK]{1}$/;
    return regex.test(rut);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!username) {
      await showUsernameError();
      return;
    }

    if (!email) {
      await showEmailError();
      return;
    }

    if (!password) {
      await showPasswordError();
      return;
    }

    if (password.length < 5) {
      await showPasswordLengthError();
      return;
    }

    if (!rut) {
      await showRutError("El RUT es obligatorio");
      return;
    }

    if (!validarRut(rut)) {
      await showRutError("El RUT tiene el formato XXXXXXXX-X, ejemplo: 12345678-9.");
      return;
    }

    if (!roles) {
      await showRoleError();
      return;
    }

    if (!facultad) {
      await showFacultyError();
      return;
    }

    console.log("Datos enviados al backend:", { username, email, password, rut, roles, facultad });

    try {
      const response = await crearUsuario({ username, email, password, rut, roles, facultad });

      console.log("Respuesta del backend:", response);

      if (response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Usuario creado con éxito"
        });
        setUsername('');
        setEmail('');
        setPassword('');
        setRut('');
        setRoles('');
        setFacultad('');
      } else if (response.status === 400 && response.data.message === "El rut ingresado posee un usuario") {
        await showRutDuplicateError();
      } else {
        await showAuthError();
      }
    } catch (error) {
      await showAuthError();
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={boxStyle}>
        <div>
          <h2 className="title">Crear Usuario</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>RUT</label>
              <input
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="Ejemplo: 12345678-9"
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
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
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
