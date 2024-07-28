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
import GenerarPDF from './routes/PDF.jsx';
import VerTicket from './routes/verTicket.jsx';
import TareasRealizadas from './routes/TareasRealizadasRoute.jsx';
import UpdateTicket from './routes/UpdateTicketRoute.jsx';
import UpdateTarea  from './routes/UpdateTareaRoute.jsx';
import FormTicket from './routes/FormTicketRoutes.jsx';
import DuplicarTarea from './routes/DuplicarTareaRoute.jsx';
import MisTareas from './routes/MisTareasRoute.jsx';

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
  },
  {
    path: '/generarpdf',
    element: <GenerarPDF/>,
  },
  {
    path: '/verTicket',
    element: <VerTicket/>,
  },
  {
    path: '/tareas-realizadas',
    element: <TareasRealizadas />,
  },
  {
    path: '/ticket/modificar',
    element: <UpdateTicket />,
  },
  {
    path: '/tarea/modificar',
    element: <UpdateTarea />,
  },
  {
    path: '/ticket',
    element: <FormTicket />,
  },
  {
    path: '/tarea/duplicar',
    element: <DuplicarTarea />,
  },
  {
    path: '/mis-tareas',
    element: <MisTareas />,
  }


]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
