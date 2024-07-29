import React, { useEffect, useState } from 'react';
import { getSupervisoresByFacultad } from '../services/user.service.js';
import Navbar from './Navbar.jsx';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [supervisores, setSupervisores] = useState([]);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const facultad = user.facultad // Asegúrate de que el nombre de la facultad se almacena correctamente

  console.log("Usuario:", user);
  console.log("Facultad:", facultad);

  useEffect(() => {
    const fetchSupervisores = async () => {
      try {
        if (facultad) {
          const response = await getSupervisoresByFacultad(facultad);
          console.log("Respuesta de supervisores:", response);
          setSupervisores(response);
        } else {
          setError('Facultad no definida');
        }
      } catch (error) {
        console.error("Error al obtener supervisores:", error);
        setError('Error al obtener supervisores');
      }
    };

    fetchSupervisores();
  }, [facultad]);

  return (
    <div className="container-content">
      <Navbar />
      <div className="main-content">
        <div className="box">
          <div className="has-text-centered">
            <h1 className="title is-2">Contactos de Supervisores</h1>
          </div>
          {error ? (
            <p>{error}</p>
          ) : supervisores.length === 0 ? (
            <p>No se encontraron supervisores.</p>
          ) : (
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {supervisores.map((supervisor) => (
                  <tr key={supervisor._id}>
                    <td>{supervisor.username}</td>
                    <td>{supervisor.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
