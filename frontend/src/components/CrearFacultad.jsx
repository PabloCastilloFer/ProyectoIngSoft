import React, { useState } from 'react';
import '../styles/Generico.css'; // Asegúrate de tener estilos para los formularios
import Navbar from '../components/Navbar.jsx';

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

const CrearFacultad = () => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);
  const [facultades, setFacultades] = useState(JSON.parse(localStorage.getItem('facultades')) || []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    if (!nombre) {
      setError('El nombre de la facultad es obligatorio');
      return;
    }

    const nuevaFacultad = { nombre };
    console.log("Datos enviados al backend:", nuevaFacultad); // Verificar datos enviados

    // Simular la creación de la facultad almacenándola en localStorage
    const facultadesActualizadas = [...facultades, nuevaFacultad];
    localStorage.setItem('facultades', JSON.stringify(facultadesActualizadas));
    setFacultades(facultadesActualizadas);

    alert('Facultad creada con éxito');
    setNombre('');
  };

  const handleDelete = (index) => {
    const facultadesActualizadas = facultades.filter((_, i) => i !== index);
    localStorage.setItem('facultades', JSON.stringify(facultadesActualizadas));
    setFacultades(facultadesActualizadas);
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
          <h3>Facultades Creadas</h3>
          <ul className="facultades-list">
            {facultades.map((facultad, index) => (
              <li key={index} className="facultad-item">
                <span>{facultad.nombre}</span>
                <button className="btn btn-danger" onClick={() => handleDelete(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrearFacultad;
