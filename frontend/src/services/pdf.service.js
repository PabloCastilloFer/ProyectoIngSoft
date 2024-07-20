// frontend/src/services/pdf.service.js
import axios from './root.service';

export const generarPDF = async () => {
  try {
    const response = await axios.post('/generar-pdf', {}, {
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
