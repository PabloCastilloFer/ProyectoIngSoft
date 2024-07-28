import Comentario from "../models/comentario.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

// Crear un nuevo comentario
export const crearComentario = async (req, res) => {
  try {
    const { rutAsignado, comentario } = req.body;

    // Obtener el rol de empleado
    const empleadoRole = await Role.findOne({ name: "empleado" });

    if (!empleadoRole) {
      return res.status(400).json({ mensaje: "El rol de empleado no existe" });
    }

    // Verificar que el usuario con el RUT asignado exista y tenga rol de empleado
    const usuario = await User.findOne({ rut: rutAsignado, roles: empleadoRole._id });

    console.log("Usuario encontrado:", usuario); // Ver qué usuario se encuentra

    if (!usuario) {
      return res.status(400).json({ mensaje: "El usuario asignado no existe o no tiene rol de empleado" });
    }

    const nuevoComentario = new Comentario({
      rutAsignado,
      comentario,
    });

    const comentarioGuardado = await nuevoComentario.save();
    respondSuccess(req, res, 201, comentarioGuardado);
  } catch (error) {
    console.log("Error al crear el comentario:", error); // Ver el error exacto
    handleError(error, "comentario.controller -> crearComentario");
    respondError(req, res, 500, "Error al crear el comentario");
  }
};

// Obtener comentarios por RUT asignado
export const obtenerComentariosPorRut = async (req, res) => {
  try {
    const { rutAsignado } = req.params;
    const comentarios = await Comentario.find({ rutAsignado });

    if (!comentarios) {
      return respondError(req, res, 404, "No se encontraron comentarios para el RUT asignado");
    }

    respondSuccess(req, res, 200, comentarios);
  } catch (error) {
    handleError(error, "comentario.controller -> obtenerComentariosPorRut");
    respondError(req, res, 500, "Error al obtener los comentarios");
  }
};

// Actualizar un comentario por ID
export const actualizarComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const { comentario } = req.body;

    const comentarioActualizado = await Comentario.findByIdAndUpdate(id, { comentario }, { new: true });

    if (!comentarioActualizado) {
      return respondError(req, res, 404, "No se encontró el comentario para actualizar");
    }

    respondSuccess(req, res, 200, comentarioActualizado);
  } catch (error) {
    handleError(error, "comentario.controller -> actualizarComentario");
    respondError(req, res, 500, "Error al actualizar el comentario");
  }
};

// Eliminar un comentario por ID
export const eliminarComentarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const comentarioEliminado = await Comentario.findByIdAndDelete(id);

    if (!comentarioEliminado) {
      return respondError(req, res, 404, "No se encontró el comentario para eliminar");
    }

    respondSuccess(req, res, 200, comentarioEliminado);
  } catch (error) {
    handleError(error, "comentario.controller -> eliminarComentarioPorId");
    respondError(req, res, 500, "Error al eliminar el comentario");
  }
};

// Obtener todos los comentarios
export const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find({});

    if (!comentarios) {
      return respondError(req, res, 404, "No se encontraron comentarios");
    }

    respondSuccess(req, res, 200, comentarios);
  } catch (error) {
    handleError(error, "comentario.controller -> obtenerComentarios");
    respondError(req, res, 500, "Error al obtener los comentarios");
  }
};
