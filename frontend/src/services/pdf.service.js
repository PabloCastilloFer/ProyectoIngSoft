import instance from './root.service';

// Función para obtener el token del almacenamiento local o cookies
const getToken = () => {
  return localStorage.getItem('token'); // O cookies.get('token') si estás usando cookies
};

export const generarPDF = async (data) => {
  try {
    const token = getToken();
    const response = await instance.post('/generatePDF', data, {  // Asegúrate de que la ruta apunte a /api/generatePDF
      headers: {
        'Authorization': `Bearer ${token}`
      },
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

export default {
  generarPDF,
};

