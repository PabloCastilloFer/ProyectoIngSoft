import React from 'react';
import 'bulma/css/bulma.min.css';
import '../styles/Login.css'; // Asegúrate de importar el CSS aquí
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { login } from '../services/auth.service';

function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    login(data).then(() => {
      navigate('/home');
    });
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(245, 245, 245, 0.8)', // Añadir un fondo semitransparente
  };

  const loginBoxStyle = {
    width: '400px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    textAlign: 'center',
  };

  const labelStyle = {
    textAlign: 'left',
  };

  return (
    <div className="page-container">
      <img src="UB.jpg" alt="Background" />
      <div style={containerStyle}>
        <div style={loginBoxStyle}>
          <h1 className="title is-3">Iniciar sesión</h1>
          <p>Ingresa tu correo electrónico para acceder a tu cuenta.</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label className="label" htmlFor="email" style={labelStyle}>Correo electrónico</label>
              <div className="control">
                <input
                  className={`input ${errors.email ? 'is-danger' : ''}`}
                  type="email"
                  id="email"
                  placeholder="ejemplo@dominio.com"
                  {...register('email', { required: 'Este campo es obligatorio' })}
                />
              </div>
              {errors.email && <p className="help is-danger">{errors.email.message}</p>}
            </div>

            <div className="field">
              <label className="label" htmlFor="password" style={labelStyle}>Contraseña</label>
              <div className="control">
                <input
                  className={`input ${errors.password ? 'is-danger' : ''}`}
                  type="password"
                  id="password"
                  placeholder="●●●●●●●●"
                  {...register('password', { required: 'Este campo es obligatorio' })}
                />
              </div>
              {errors.password && <p className="help is-danger">{errors.password.message}</p>}
            </div>

            <div className="field">
              <div className="control">
                <button type="submit" className="button is-link">Iniciar sesión</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
