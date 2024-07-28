import axios from './root.service';

export const createTarea = async (formData, jwt) => {
    try {
        console.log("1", formData);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${jwt}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.post('/tarea', formData, config);
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

export const updateTarea = async (formData, idTarea) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };
        const response = await axios.put(`/tarea/${idTarea}`, formData, config);
        return response;
    } catch (error) {
        return { status: 500, data: [error], error: error.message };
    }
};

export const getTarea = async (searchValue) => {
    try {
        const response = await axios.get(`/tarea/${searchValue}`);
        const data = response.data;
        return [data];
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [error], error: error.message };
    }
};

export const deleteTarea = async (idTarea) => {
    try {
        const response = await axios.delete(`/tarea/${idTarea}`);
        return response;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [error], error: error.message };
    }
};

export const duplicarTarea = async (formData, idTarea) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        };
        const response = await axios.post(`/tarea/${idTarea}`, formData, config);
        return response;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [error], error: error.message };
    }
};