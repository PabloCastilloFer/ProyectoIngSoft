import React, { useState } from 'react';
import { crearFacultad } from '../services/facultad.service';
import '../styles/Generico.css'; // Asegúrate de tener estilos para los formularios

const CrearFacultad = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await crearFacultad({ nombre, descripcion });
    if (response.status === 201) {
      alert('Facultad creada con éxito');
      setNombre('');
      setDescripcion('');
    } else {
      alert('Error al crear la facultad');
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Facultad</h2>
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
          <label>Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear Facultad</button>
      </form>
    </div>
  );
};

export default CrearFacultad;
