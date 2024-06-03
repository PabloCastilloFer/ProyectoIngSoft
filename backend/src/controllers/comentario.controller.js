import Comentario from "../models/comentario.model.js";
import Tarea from "../models/tarea.model.js";
import User from "../models/user.model.js";

export const ComentarioController = {
  async crearComentario(req, res) {
    try {
      const { supervisor, rutEmpleado, tarea, comentario } = req.body;

      // Verificar si el usuario supervisor existe
      const supervisorExistente = await User.findOne({ rut: supervisor });
      if (!supervisorExistente) {
        return res.status(404).json({ error: "Supervisor no encontrado" });
      }

      // Verificar si el usuario empleado existe
      const empleadoExistente = await User.findOne({ rut: rutEmpleado });
      if (!empleadoExistente) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

      // Crear un nuevo comentario
      const nuevoComentario = new Comentario({
        supervisor,
        empleado: rutEmpleado,
        tarea,
        comentario,
      });

      // Guardar el comentario en la base de datos
      await nuevoComentario.save();

      // Buscar la tarea asociada al comentario
      const tareaAsociada = await Tarea.findById(tarea).select('nombreTarea descripcionTarea estado');

      // Agregar la tarea asociada al comentario
      nuevoComentario.tarea = tareaAsociada;

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
      const { empleadoRut } = req.params;
      const { comentario } = req.body;

      // Buscar el comentario por rut y actualizarlo
      const comentarioModificado = await Comentario.findOneAndUpdate(
        { empleadoRut },
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
      const { empleadoRut } = req.params;

      // Buscar el comentario por su ID y eliminarlo
      const comentarioEliminado = await Comentario.findOneAndDelete({ empleadoRut });

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
