import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Navbar from '../components/navbar.jsx';
import '../styles/Generico.css'; // Asegúrate de importar tu archivo de estilos
import iuser from '../assets/user.png'; // Asegúrate de importar tu ícono de usuario

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const { user } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="user-details-container">
        <div className="user-info">
          <div className="user-icon">
            <img src={iuser} alt="User Icon" style={{ width: '20px', height: '20px' }} />
          </div>
          <p>Bienvenido/a</p>
          <p>{user?.email}</p>
        </div>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <Outlet />
    </div>
  );
}

export default Root;
