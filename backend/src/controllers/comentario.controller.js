import Comentario from "../models/comentario.model.js";
import Tarea from "../models/tarea.model.js";
import User from "../models/user.model.js";

export const ComentarioController = {
  async crearComentario(req, res) {
    try {
      // Verificar si el usuario está autenticado y tiene el RUT en el token
      if (!req.rut) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const { rutEmpleado, tarea, comentario } = req.body;
      const supervisor = req.rut;

      // Mensajes de depuración
      console.log("Datos recibidos en la solicitud:");
      console.log("Supervisor:", supervisor);
      console.log("Rut del Empleado:", rutEmpleado);
      console.log("Tarea:", tarea);
      console.log("Comentario:", comentario);

      // Verificar si el usuario empleado existe
      const empleadoExistente = await User.findOne({ rut: rutEmpleado });
      if (!empleadoExistente) {
        console.log('Empleado no encontrado:', rutEmpleado);
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

      // Verificar si la tarea existe
      const tareaExistente = await Tarea.findById(tarea);
      if (!tareaExistente) {
        console.log('Tarea no encontrada:', tarea);
        return res.status(404).json({ error: "Tarea no encontrada" });
      }

      // Crear un nuevo comentario
      const nuevoComentario = new Comentario({
        supervisor,
        RutAsignado: rutEmpleado,  // Asegúrate de que el campo es correcto
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
