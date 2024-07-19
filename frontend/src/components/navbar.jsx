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
        <li onClick={() => handleNavigation('/tareas')}>Ver tareas</li>
        <li onClick={() => handleNavigation('/')}>asignar tarea</li>
        <li onClick={() => handleNavigation('/')}>Finanzas</li>
        <li onClick={() => handleNavigation('/')}>Proveedores</li>
        <li onClick={() => handleNavigation('/')}>Finanzas Boletas</li>
      </ul>
    </div>
  );
};

export default Navbar;