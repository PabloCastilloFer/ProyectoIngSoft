import React, { useState } from 'react';
import { crearFacultad } from '../services/facultad.service';
import '../styles/Generico.css'; // Asegúrate de tener estilos para los formularios
import Navbar from '../components/navbar.jsx';

const CrearFacultad = () => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!nombre) {
      setError('El nombre de la facultad es obligatorio');
      return;
    }

    console.log("Datos enviados al backend:", { nombre }); // Verificar datos enviados

    const response = await crearFacultad({ nombre });

    console.log("Respuesta del backend:", response); // Verificar respuesta del backend

    if (response.status === 201) {
      alert('Facultad creada con éxito');
      setNombre('');
    } else {
      setError('Error al crear la facultad: ' + response.data?.message || response.error);
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={boxStyle}>
        <div className="form-container">
          <h2>Crear Facultad</h2>
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
            <button type="submit" className="btn btn-primary">Crear Facultad</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearFacultad;
