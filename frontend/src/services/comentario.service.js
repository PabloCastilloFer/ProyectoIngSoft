import axios from './root.service';

export const agregarComentario = async (data) => {
  try {
    console.log("Intentando agregar comentario:", data);
    const response = await axios.post('/comentarios', data);
    console.log("Comentario agregado:", response);
    return response;
  } catch (error) {
    console.log("Error al agregar comentario:", error);
    return error.response;
  }
};
