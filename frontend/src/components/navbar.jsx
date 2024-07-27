import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBarStyle.css';
import logo from '../assets/Logo.png';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isInformeEmpleadosMenuOpen, setIsInformeEmpleadosMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedState = localStorage.getItem('isSidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  const handleToggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('isSidebarCollapsed', JSON.stringify(newState));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleUsersMenuToggle = () => {
    setIsUsersMenuOpen(!isUsersMenuOpen);
  };

  const handleInformeEmpleadosMenuToggle = () => {
    setIsInformeEmpleadosMenuOpen(!isInformeEmpleadosMenuOpen);
  };

  const navbarStyle = {
    position: 'fixed',
    right: '0',
    top: '0',
    height: '100vh',
    width: '250px',
  };

  return (
    <div style={navbarStyle}>
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="logo-container" onClick={() => handleNavigation('/home')}>
          <img src={logo} alt="Logo" />
        </div>
        <button onClick={handleToggleSidebar}>
          {isCollapsed ? '🡸' : '🡺'}
        </button>
        <ul>
          <li data-icon="📁" onClick={() => handleNavigation('/tarea')}>
            <span>Crear Tarea</span>
          </li>
          <li data-icon="📄" onClick={() => handleNavigation('/tareas')}>
            <span>Ver Tareas</span>
          </li>
          <li data-icon="📤" onClick={() => handleNavigation('/verticket')}>
            <span>Tareas asignadas</span>
          </li>
          <li data-icon="📋" onClick={handleInformeEmpleadosMenuToggle}>
            <span>Informe Empleados {isInformeEmpleadosMenuOpen ? '▲' : '▼'}</span>
          </li>
          {isInformeEmpleadosMenuOpen && (
            <ul className="submenu">
              <li data-icon=">" onClick={() => handleNavigation('/generarPDF')}>
                <span>Generar PDF</span>
              </li>
              <li data-icon=">" onClick={() => handleNavigation('/Agregarcomentario')}>
                <span>Agregar Comentario</span>
              </li>
            </ul>
          )}
          <li data-icon="📃" onClick={() => handleNavigation('/tareas-asignadas')}>
            <span>Ver Tareas Asignadas</span>
          </li>
          <li data-icon="📍" onClick={() => handleNavigation('/tareas-realizadas')}>
            <span>Tareas Realizadas</span>
          </li>
          <li data-icon="🏢" onClick={() => handleNavigation('/facultades')}>
            <span>Facultades</span>
          </li>
          <li data-icon="👤" onClick={handleUsersMenuToggle}>
            <span>Usuarios {isUsersMenuOpen ? '▲' : '▼'}</span>
          </li>
          {isUsersMenuOpen && (
            <ul className="submenu">
              <li data-icon=">" onClick={() => handleNavigation('/usuarios')}>
                <span>Crear Usuario</span>
              </li>
              <li data-icon=">" onClick={() => handleNavigation('/usuarios/ver')}>
                <span>Ver Usuarios</span>
              </li>
            </ul>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
