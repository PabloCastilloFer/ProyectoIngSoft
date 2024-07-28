import axios from './root.service'; // Asegúrate de tener configurado root.service.js correctamente
import cookies from 'js-cookie';

// Función para crear una tarea realizada
export const createTareaRealizada = async (formData, rutUsuario) => {
    try {
        const token = cookies.get('jwt-auth'); // Obtén el token JWT de las cookies
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.post(`/tareaRealizada/${rutUsuario}`, formData, config);
        return response;
    } catch (error) {
        if (error.response) {
            // Errores de respuesta del servidor (4xx, 5xx)
            return error.response;
        } else if (error.request) {
            // Errores relacionados con la solicitud
            return { status: 500, data: null, error: "No response received from server" };
        } else {
            // Otros errores
            return { status: 500, data: null, error: error.message };
        }
    }
};

// tareaRealizada.service.js

export const getTareasAsignadas = async (rutUsuario) => {
  try {
      const token = cookies.get('jwt-auth'); // Obtén el token JWT de las cookies
      const config = {
          headers: {
              'Authorization': `Bearer ${token}` // Agregar el token JWT al encabezado Authorization
          },
      };
      const response = await axios.get(`/tareaRealizada/asignadas/${rutUsuario}`, config);
      return response.data;
  } catch (error) {
      if (error.response && error.response.status === 404) {
          // Si la respuesta de la API es 404, devuelve un objeto específico
          return { status: 404, data: [], message: 'No hay tareas asignadas' };
      } else {
          console.error('Error en la solicitud:', error);
          return { status: 500, data: [], error: error.message };
      }
  }
};


// Función para obtener todas las tareas realizadas
export const getTareasRealizadas = async (rutUsuario) => {
    try {
        const token = cookies.get('jwt-auth'); // Obtén el token JWT de las cookies
        const config = {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.get(`/tareaRealizada/${rutUsuario}`, config);
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

// Función para obtener tareas completadas
export const getTareasCompletadas = async (rutUsuario) => {
    try {
        const token = cookies.get('jwt-auth'); // Obtén el token JWT de las cookies
        const config = {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.get(`/tareaRealizada/${rutUsuario}/completadas`, config);
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

// Función para obtener tareas incompletas
export const getTareasIncompletas = async (rutUsuario) => {
    try {
        const token = cookies.get('jwt-auth'); // Obtén el token JWT de las cookies
        const config = {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.get(`/tareaRealizada/${rutUsuario}/incompletas`, config);
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

// Función para obtener tareas no realizadas
export const getTareasNoRealizadas = async (rutUsuario) => {
    try {
        const token = cookies.get('jwt-auth'); // Obtén el token JWT de las cookies
        const config = {
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.get(`/tareaRealizada/${rutUsuario}/noRealizadas`, config);
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};