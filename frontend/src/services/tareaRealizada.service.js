import axios from './root.service'; // Asegúrate de tener configurado root.service.js correctamente

export const createTareaRealizada = async (formData, rutUsuario) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                 // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.post(`/tareaRealizada/20829012-6`,formData);
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

export const getTareasAsignadas = async (rutUsuario, jwt) => {
    try {
      
        const response = await axios.get(`/tareaRealizada/asignadas/20829012-6`);
        console.log(":hola" ,response) 
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [], error: error.message };
    }
};

export const getTareasRealizadas = async (rutUsuario) => {
    try {
      const response = await axios.get(`/tareaRealizada/20829012-6`);
      return response.data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };
  
  export const getTareasCompletadas = async (rutUsuario) => {
    try {
      const response = await axios.get(`/tareaRealizada/completadas/20829012-6`);
      return response.data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };
  
  export const getTareasIncompletas = async (rutUsuario) => {
    try {
      const response = await axios.get(`/tareaRealizada/incompletas/20829012-6`);
      return response.data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };
  
  export const getTareasNoRealizadas = async (rutUsuario) => {
    try {
      const response = await axios.get(`/tareaRealizada/noRealizadas/20829012-6`);
      return response.data;
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  };