import React, { useState } from 'react';
import '../styles/Generico.css'; // Asegúrate de tener estilos para los formularios
import Navbar from '../components/Navbar.jsx';
import { showConfirmFacultyCreated,DeleteFacultyQuestion } from '../helpers/swaHelper.js';


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
    console.log("Datos enviados al backend:", nuevaFacultad); 


    const facultadesActualizadas = [...facultades, nuevaFacultad];
    localStorage.setItem('facultades', JSON.stringify(facultadesActualizadas));
    setFacultades(facultadesActualizadas);

    showConfirmFacultyCreated(); //
    setNombre('');
  };

  const handleDelete = async (index) => {
    const confirmed = await DeleteFacultyQuestion();
    if (confirmed) {
      const facultadesActualizadas = facultades.filter((_, i) => i !== index);
      localStorage.setItem('facultades', JSON.stringify(facultadesActualizadas));
      setFacultades(facultadesActualizadas);
    }
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <div style={boxStyle}>
        <div>
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