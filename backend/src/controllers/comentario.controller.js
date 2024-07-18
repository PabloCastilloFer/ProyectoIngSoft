import Comentario from "../models/comentario.model.js";
import Tarea from "../models/tarea.model.js";

// Controlador para crear un nuevo comentario
export const crearComentario = async (req, res) => {
  try {
    const { RutAsignado, tareaId, comentario } = req.body;

    const tareaExistente = await Tarea.findOne({ idTarea: tareaId});
    if (!tareaExistente) {
      return res.status(404).json({ mensaje: "La tarea no existe" });
    }

    const nuevoComentario = await Comentario.create({ ticket: RutAsignado, tarea: tareaId, comentario });
    res.status(201).json({ mensaje: "Comentario creado correctamente", comentario: nuevoComentario });
  } catch (error) {
    res.status(400).json({ mensaje: "Hubo un error al crear el comentario", error: error.message });
  }
};
// Controlador para actualizar un comentario por su ID
export const actualizarComentario = async (req, res) => {
  const { id } = req.params;
  const { comentario } = req.body;
  console.log('ID del comentario a actualizar:', id);
  console.log('Nuevo comentario:', comentario);

  try {
    const comentarioActualizado = await Comentario.findByIdAndUpdate(id, { comentario }, { new: true });
    if (!comentarioActualizado) {
      return res.status(404).json({ mensaje: "Comentario no encontrado" });
    }
    res.status(200).json({ mensaje: "Comentario actualizado correctamente", comentario: comentarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Hubo un error al actualizar el comentario", error: error.message });
  }
};


export const obtenerComentariosPorRut = async (req, res) => {
  const { RutAsignado } = req.params;

  console.log('RutAsignado recibido:', RutAsignado); // Log para verificar el parámetro

  try {
    const comentarios = await Comentario.find({ ticket: RutAsignado }).populate('tarea');
    console.log('Comentarios encontrados:', comentarios); // Log de los comentarios obtenidos

    if (comentarios.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron comentarios para este rut' });
    }

    res.status(200).json(comentarios);
  } catch (error) {
    console.error('Error al obtener los comentarios:', error); // Log del error
    res.status(500).json({ mensaje: "Hubo un error al obtener los comentarios", error: error.message });
  }
};


// Controlador para eliminar un comentario por su ID
export const eliminarComentarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const comentarioEliminado = await Comentario.findByIdAndDelete(id);
    if (!comentarioEliminado) {
      return res.status(404).json({ mensaje: "Comentario no encontrado" });
    }
    res.status(200).json({ mensaje: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Hubo un error al eliminar el comentario", error: error.message });
  }
};

// Controlador para obtener todos los comentarios
export const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find();
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Hubo un error al obtener los comentarios", error: error.message });
  }
};