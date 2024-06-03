import Comentario from "../models/comentario.model.js";
import Tarea from "../models/tarea.model.js";
import User from "../models/user.model.js";

export const ComentarioController = {
  async crearComentario(req, res) {
    try {
      // Obtén los datos del comentario desde el cuerpo de la solicitud
      const { rutEmpleado, tarea, comentario } = req.body;

      // No se realiza ninguna verificación de autenticación aquí

      // Crear un nuevo comentario
      const nuevoComentario = new Comentario({
        RutAsignado: rutEmpleado,
        tarea,
        comentario,
      });

      // Guardar el comentario en la base de datos
      await nuevoComentario.save();

      // Retornar el comentario creado
      res.status(201).json(nuevoComentario);
    } catch (error) {
      console.error("Error al dejar un comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async listarComentarios(req, res) {
    try {
      // Obtener todos los comentarios de la base de datos y popular el campo tarea
      const comentarios = await Comentario.find().populate('tarea', 'nombreTarea descripcionTarea estado');

      res.status(200).json(comentarios);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async modificarComentario(req, res) {
    try {
      const { id } = req.params;
      const { comentario } = req.body;

      // Buscar el comentario por ID y actualizarlo
      const comentarioModificado = await Comentario.findByIdAndUpdate(
        id,
        { comentario },
        { new: true }
      ).populate('tarea', 'nombreTarea descripcionTarea estado');

      if (!comentarioModificado) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }

      res.status(200).json(comentarioModificado);
    } catch (error) {
      console.error("Error al modificar comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async eliminarComentario(req, res) {
    try {
      const { id } = req.params;

      // Buscar el comentario por ID y eliminarlo
      const comentarioEliminado = await Comentario.findByIdAndDelete(id);

      if (!comentarioEliminado) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }

      res.status(200).json({ mensaje: "Comentario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
