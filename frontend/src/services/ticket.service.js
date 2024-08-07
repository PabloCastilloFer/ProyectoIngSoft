import axios from './root.service';

export const createTicket = async (FormData, jwt) => {
    try {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}` // Agregar el token JWT al encabezado Authorization
            },
        };
        const response = await axios.post('/ticket', FormData, config);
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

export const updateTicket = async (data, TareaID) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await axios.put(`/ticket/tarea/${TareaID}`, data, config);
        return response;
    } catch (error) {
        return { status: 500, data: [error], error: error.message };
    }
};

export const getTicket = async (searchValue) => {
    try {
        const response = await axios.get(`/ticket/${searchValue}`);
        const data = response.data;
        return [data];
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [error], error: error.message };
    }
};

export const deleteTicket = async (ticketId) => {
    try {
        const response = await axios.delete(`/ticket/${ticketId}`);
        return response;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [error], error: error.message };
    }
};

export const getEmptyTicket = async () => {
    try {
        const response = await axios.get('/ticket/tareas/NoAsignadas');
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [], error: error.message };
    }
};

export const getAsignadoTicket = async () => {
    try {
        const response = await axios.get('/ticket/tareas');
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return { status: 500, data: [], error: error.message };
    }
};