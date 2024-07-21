import axios from './root.service';

// Función para obtener el token del almacenamiento local o cookies
const getToken = () => {
  return localStorage.getItem('token'); // O cookies.get('token') si estás usando cookies
};

export const crearUsuario = async (data,jwt) => {
  try {
    const config = {
      headers: {
          'Authorization': `Bearer ${jwt}`
        }
    };
    const response = await axios.post('/users', data, config);
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
  crearUsuario,

};
