import instance from './root.service';

export const crearFacultad = async (facultadData) => {
  try {
    const response = await instance.post('/facultades', facultadData);
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
  crearFacultad,
};
