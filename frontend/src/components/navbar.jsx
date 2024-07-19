import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavbarStyle.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
      </div>
      <ul>
        <li onClick={() => handleNavigation('/home')}>Página Principal</li>
        <li onClick={() => handleNavigation('/tarea')}>Crear una tarea</li>
        <li onClick={() => handleNavigation('/historial-precios')}>Ver tareas</li>
        <li onClick={() => handleNavigation('/estadisticas')}>asignar tarea</li>
        <li onClick={() => handleNavigation('/finanzas')}>Finanzas</li>
        <li onClick={() => handleNavigation('/proveedores')}>Proveedores</li>
        <li onClick={() => handleNavigation('/finanzas-boletas')}>Finanzas Boletas</li>
      </ul>
    </div>
  );
};

export default Navbar;