import axios from './root.service';
export const obtenerDatosPDF = async () => {
    try {
        const response = await axios.get('/obtener-datos-pdf');
        return response.data;
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

export const generarPDF = async (datosFormulario) => {
    try {
        const response = await axios.post('/generar-pdf', datosFormulario, {
            responseType: 'blob',
        });
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