import ReactDOM from 'react-dom/client';
import App from './routes/App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.jsx';
import ErrorPage from './routes/ErrorPage.jsx';
import Login from './routes/Login.jsx';
import Tarea from './routes/Tarea.jsx';
import GenerarPDF from './routes/PDF.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <App />,
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/tarea',
    element: <Tarea/>,
  },
  {
    path: '/generarpdf',
    element: <GenerarPDF/>,
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
