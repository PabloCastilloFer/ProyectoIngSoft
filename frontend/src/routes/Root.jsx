import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Navbar from '../components/navbar.jsx';
import { BrowserRouter } from 'react-router-dom';

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
      <h2>Datos del Usuario</h2>
      <p>Nombre: {user?.username}</p>
      <p>RUT: {user?.rut}</p>
      <p>Correo electrónico: {user?.email}</p>
      <p>Facultad: {user?.facultades}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
      <Outlet />
    </div>
  );
}

export default Root;
