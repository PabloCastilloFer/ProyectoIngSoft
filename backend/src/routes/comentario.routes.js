import express from "express";
import { ComentarioController } from "../controllers/comentario.controller.js";


const router = express.Router();

// Ruta para crear un nuevo comentario
router.post("/comentarios", ComentarioController.crearComentario);

// Ruta para obtener todos los comentarios
router.get("/comentarios", ComentarioController.listarComentarios);

// Ruta para obtener un comentario por su ID
router.get("/comentarios/:rut", ComentarioController.obtenerComentario);

// Ruta para actualizar un comentario por su ID
router.put("/comentarios/:rut", ComentarioController.actualizarComentario);

// Ruta para eliminar un comentario por su ID
router.delete("/comentarios/:rut", ComentarioController.eliminarComentario);

export default router;
