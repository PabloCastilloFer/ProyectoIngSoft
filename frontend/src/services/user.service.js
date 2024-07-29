import axios from './root.service';

export const crearUsuario = async (data) => {
  try {
    const dataUser = {
      username: data.username,
      email: data.email,
      password: data.password,
      rut: data.rut,
      roles: [data.roles],
      facultades: [data.facultad],
    };

    const response = await axios.post('/users', dataUser);
    return response;
  } catch (error) {
    if (error.response) {
      console.log("Error de respuesta del backend:", error.response);

      // Verifica si el error es debido a un RUT duplicado
      if (error.response.data && error.response.data.message === "El rut ingresado posee un usuario") {
        return {
          status: error.response.status,
          data: { message: "El rut ingresado posee un usuario" }
        };
      }

      return error.response;
    } else if (error.request) {
      console.log("Error de solicitud:", error.request);
      return { status: 500, data: null, error: "No response received from server" };
    } else {
      console.log("Otro error:", error.message);
      return { status: 500, data: null, error: error.message };
    }
  }
};

export const getUserByRut = async (rut) => {
  try {
    const response = await axios.get(`/users/rut/${rut}`);
    console.log('Usuario obtenido por RUT:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al obtener usuario por RUT:', error);
    throw error;
  }
};

// Otras funciones existentes
export const getUsersByRole = async (role) => {
  try {
    const response = await axios.get(`/users/rol/${role}`);
    console.log('Usuarios obtenidos por rol:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error al obtener usuarios por rol:', error);
    throw error;
  }
};

