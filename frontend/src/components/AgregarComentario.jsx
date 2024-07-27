import React, { useState, useEffect } from 'react';
import { agregarComentario } from '../services/comentario.service';
import { getEmpleados } from '../services/user.service';
import Navbar from '../components/Navbar.jsx';
import '../styles/Generico.css';
import { showRutError } from '../helpers/swaHelper.js';

const AgregarComentario = () => {
  const [rutAsignado, setRutAsignado] = useState('');
  const [comentario, setComentario] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        console.log("Fetching empleados...");
        const empleados = await getEmpleados();
        console.log("Empleados obtenidos:", empleados);
        setEmpleados(empleados);
      } catch (error) {
        console.log('Error al obtener empleados:', error);
        setError('Error al obtener empleados');
      }
    };
    fetchEmpleados();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!rutAsignado) {
      await showRutError();
      return;
    }

    if (!comentario) {
      setError('El comentario no puede estar vacío');
      return;
    }

    try {
      const response = await agregarComentario({ rutAsignado, comentario });
      console.log('Comentario agregado:', response);
      alert('Comentario agregado con éxito');
      setRutAsignado('');
      setComentario('');
    } catch (error) {
      console.log('Error al agregar comentario:', error);
      setError('Error al agregar comentario');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <div style={{ margin: 'auto', padding: '20px', width: '100%', maxWidth: '600px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <div className="form-container">
          <h2>Agregar Comentario</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>RUT Asignado</label>
              <select
                value={rutAsignado}
                onChange={(e) => setRutAsignado(e.target.value)}
                required
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.rut} value={empleado.rut}>
                    {empleado.username} - {empleado.rut}
                  </option>
                ))}
              </select>
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
