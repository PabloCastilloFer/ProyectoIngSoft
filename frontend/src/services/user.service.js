import axios from './root.service';

// const getToken = () => {
//   return localStorage.getItem('user'); 
// };

export const crearUsuario = async (data) => {
  try {
    // const token = getToken();
    // const config = {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // };
    const dataUser= {
      username: data.username,
      email: data.email,
      password: data.password,
      rut: data.rut,
      roles: [data.roles],
      facultades: [data.facultad],
    }
    const response = await axios.post('/users', dataUser);
    return response;
  } catch (error) {
    if (error.response) {
      console.log("Error de respuesta del backend:", error.response);
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
