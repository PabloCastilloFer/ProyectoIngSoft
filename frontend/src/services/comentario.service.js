import axios from './root.service';

export const agregarComentario = async (data) => {
  try {
    const response = await axios.post('/comentarios', data);
    return response.data;
  } catch (error) {
    console.log('Error al agregar comentario:', error);
    throw error;
  }
};


