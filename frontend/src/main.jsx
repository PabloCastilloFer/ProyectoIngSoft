import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import Tarea from './routes/Tarea.jsx';
import Tareas from './routes/verTareas.jsx';
import TareasAsignadasRoute from './routes/TareasAsignadasRoute.jsx';
import FormTareaRealizadaRoute from './routes/FormTareaRealizadaRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/home',
        element: <App />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/Tarea',
    element: <Tarea/>,
  },
  {
    path: '/Tareas',
    element: <Tareas/>,
  },
  {
    path: '/tareas-asignadas',
    element: <TareasAsignadasRoute />,
  },
  {
    path: '/responder-tarea/:id',
    element: <FormTareaRealizadaRoute />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);