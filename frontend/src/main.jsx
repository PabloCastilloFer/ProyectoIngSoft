import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import Tarea from './routes/Tarea.jsx';
import Tareas from './routes/verTareas.jsx';
import GenerarPDF from './routes/PDF.jsx';
import UpdateTarea  from './routes/UpdateTareaRoute.jsx';

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
    path: '/generarpdf',
    element: <GenerarPDF/>,
  },
  {
    path: '/tarea/modificar',
    element: <UpdateTarea />,
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
