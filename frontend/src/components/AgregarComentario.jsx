import React, { useState } from 'react';
import { agregarComentario } from '../services/comentario.service'; // Asegúrate de crear este servicio
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

const AgregarComentario = () => {
  const [rut, setRut] = useState('');
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!rut || !comentario) {
      setError('El RUT y el comentario son obligatorios');
      return;
    }

    try {
      const response = await agregarComentario({ rut, comentario });

      if (response.status === 201) {
        alert('Comentario agregado con éxito');
        setRut('');
        setComentario('');
      } else {
        setError('Error al agregar el comentario: ' + (response.data?.message || response.error));
      }
    } catch (error) {
      setError('Error al agregar el comentario: ' + error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div className="form-container">
          <h2>Agregar Comentario</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>RUT del Empleado</label>
              <input
                type="text"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Comentario</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Agregar Comentario</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarComentario;
