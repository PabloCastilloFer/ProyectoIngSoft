import express from 'express';
import { 
  crearComentario,
  obtenerComentariosPorRut,
  actualizarComentario,
  eliminarComentarioPorId,
  obtenerComentarios 
} from '../controllers/comentario.controller.js';
import { isSupervisor } from '../middlewares/authorization.middleware.js';

const router = express.Router();

// Ruta para crear un nuevo comentario
router.post("/", isSupervisor, crearComentario);

// Ruta para obtener comentarios por el rut del usuario asignado
router.get("/:RutAsignado", obtenerComentariosPorRut);

// Ruta para actualizar un comentario por su ID
router.put("/:id", isSupervisor, actualizarComentario);

// Ruta para obtener todos los comentarios
router.get('/', obtenerComentarios);

// Ruta para eliminar un comentario por su ID
router.delete("/:id", isSupervisor, eliminarComentarioPorId);

export default router;
