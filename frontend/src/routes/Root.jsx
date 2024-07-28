import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/navbar.jsx';
import TopBar from '../components/TopBar.jsx';
import '../styles/Generico.css'; 
import '../styles/App.css';

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div>
      <TopBar />
      <div className="main-content" style={{ marginTop: '50px', position: 'relative' }}>
        <div className="page-container">
          <img
            src="/UB.jpg"
            alt="Descripción de la imagen" 
          />
        </div>
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
}

export default Root;
