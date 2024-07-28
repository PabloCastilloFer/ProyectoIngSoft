import axios from './root.service';

export const agregarComentario = async (data) => {
  try {
    const response = await axios.post('/comentario', data);
    return response.data;
  } catch (error) {
    console.log('Error al agregar comentario:', error);
    throw error;
  }
};
export const obtenerComentariosPorRut = async (rutAsignado) => {
  try {
    const response = await axios.get(`/comentario/rut/${rutAsignado}`);
    return response.data;
  } catch (error) {
    console.log('Error al obtener comentarios:', error);
    throw error;
  }
};

export const actualizarComentario = async (id, data) => {
  try {
    const response = await axios.put(`/comentario/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Error al actualizar comentario:', error);
    throw error;
  }
};

export const eliminarComentario = async (id) => {
  try {
    const response = await axios.delete(`/comentario/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error al eliminar comentario:', error);
    throw error;
  }
};
