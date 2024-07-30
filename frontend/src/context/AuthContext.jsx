import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState('');

  const user = JSON.parse(localStorage.getItem('user')) || '';
  const isAuthenticated = user ? true : false;

  useEffect(() => {
    // Obtener el token JWT de las cookies
    const token = cookies.get('jwt-auth');
    if (token) {
      setJwt(token);
    } else {
      navigate('/auth');
    }
    
    if(!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
