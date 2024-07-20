import axios from './root.service'; // Asegúrate de tener configurado root.service.js correctamente

export const createTareaRealizada = async (formData, rutUsuario, jwt) => {
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

// Otros métodos según sea necesario...
