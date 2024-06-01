import Comentario from "../models/comentario.model.js";
import Tarea from "../models/tarea.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import mongoose from 'mongoose';

async function obtenerInformacionPersonaPorRut(rut) {
  try {
    // Buscar el usuario por su RUT y poblar el campo roles
    const usuario = await User.findOne({ rut }).populate('roles').exec();

    // Verificar si el usuario existe
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Extraer los roles del usuario
    const roles = usuario.roles.map(role => role.name);

    return { rut, roles };
  } catch (error) {
    console.error('Error al obtener información de la persona por RUT:', error);
    throw error;
  }
}

export const ComentarioController = {
  async crearComentario(req, res) {
    try {
      const { supervisorRut, empleadoRut, tarea, comentario } = req.body;

      // Buscar el ObjectId del rol "supervisor"
      const supervisorRole = await Role.findOne({ name: "supervisor" });

      // Verificar que el usuario supervisor exista y sea un supervisor
      const supervisorInfo = await obtenerInformacionPersonaPorRut(supervisorRut);
      if (!supervisorInfo.roles.includes('supervisor')) {
        return res.status(404).json({ error: "El usuario no es un supervisor" });
      }

      // Buscar al empleado por su RUT
      const empleado = await User.findOne({ rut: empleadoRut });
      if (!empleado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

     // Crear un nuevo comentario
      const nuevoComentario = new Comentario({
        supervisorRut: supervisorRut,
        empleadoRut: empleadoRut,
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
