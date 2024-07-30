import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBarStyle.css';
import logo from '../assets/Logo.png';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
  const [isInformeEmpleadosMenuOpen, setIsInformeEmpleadosMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect executed"); // Verificar si el useEffect se ejecuta

    const user = localStorage.getItem('user');
    console.log("User from localStorage:", user); // Mostrar el objeto user del localStorage

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("Parsed User:", parsedUser); // Mostrar el objeto user parseado

      if (parsedUser.roles && parsedUser.roles.length > 0) {
        const role = parsedUser.roles[0].name; // Asumimos que el rol está en el primer objeto del array
        setUserRole(role);
        console.log("User Role:", role); // Mostrar el rol del usuario
      } else {
        console.log("No roles found in user object.");
      }
    } else {
      console.log("No user found in localStorage.");
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
    zIndex: 20,
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
          {userRole === 'supervisor' && (
            <>
              <li data-icon="📁" onClick={() => handleNavigation('/tarea')}>
                <span>Crear tarea</span>
              </li>
              <li data-icon="📋" onClick={() => handleNavigation('/mis-tareas')}>
                <span>Mis tareas creadas</span>
              </li>
              <li data-icon="📤" onClick={() => handleNavigation('/verticket')}>
                <span>Tareas asignadas</span>
              </li>
              <li data-icon="📇" onClick={handleInformeEmpleadosMenuToggle}>
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
                  <li data-icon=">" onClick={() => handleNavigation('/comentarios')}>
                    <span>Ver Comentarios</span>
                  </li>
                </ul>
              )}
              <li data-icon="📃" onClick={() => handleNavigation('/tareas-asignadas')}>
                <span>Ver tareas asignadas</span>
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
            </>
          )}
          {userRole === 'admin' && (
            <>
              <li data-icon="📄" onClick={() => handleNavigation('/tareas')}>
                <span>Ver tareas</span>
              </li>
              <li data-icon="📃" onClick={() => handleNavigation('/tareas-asignadas')}>
                <span>Ver tareas asignadas</span>
              </li>
              <li data-icon="📍" onClick={() => handleNavigation('/tareas-realizadas')}>
                <span>Tareas Realizadas</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
