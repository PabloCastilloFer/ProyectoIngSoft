import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/auth.service';
import iuser from '../assets/user.png'; // Icono de usuario
import '../styles/TopBar.css';

const TopBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Navega a la página de perfil
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="top-bar">
      <div className="user-section" onClick={handleMenuToggle}>
        <img src={iuser} alt="User Icon" className="user-icon" />
        <span>Bienvenid@ {user?.email}</span>
        <span className="dropdown-arrow">{isMenuOpen ? '▲' : '▼'}</span>
      </div>
      {isMenuOpen && (
        <ul className="submenu">
          <li className="submenu-item" onClick={handleProfileClick}>
            <span>Mi Perfil</span>
          </li>
          <li className="submenu-item" onClick={handleLogout}>
            <span>Cerrar Sesión</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default TopBar;
