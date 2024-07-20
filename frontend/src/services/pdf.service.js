// frontend/src/services/pdf.service.js
import instance from './root.service';

export const generarPDF = async (data) => {
  try {
    const response = await instance.post('/generatePDF', { data }, {
      responseType: 'blob',
    });
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

export default {
  generarPDF,
};
