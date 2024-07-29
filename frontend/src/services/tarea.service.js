import axios from './root.service';

export const createTarea = async (formData, jwt) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${jwt}`
            },
        };
        const response = await axios.post('/tarea', formData, config);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else if (error.request) {
            return { status: 500, data: null, error: "No response received from server" };
        } else {
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

export const obtenerMisTareas = async (email) => {
    try {
        const response = await axios.get(`/tarea/mi-tarea/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [error], error: error.message };
    }
}