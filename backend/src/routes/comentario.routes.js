import express from "express";
import { ComentarioController } from "../controllers/comentario.controller.js";
import { isSupervisor }  from "../middlewares/authorization.middleware.js";

const router = express.Router();

// Ruta para crear un nuevo comentario
router.post("/",isSupervisor, ComentarioController.crearComentario);

// Ruta para obtener todos los comentarios
router.get("/", ComentarioController.listarComentarios);

router.delete("/:rutEmpleado", isSupervisor, ComentarioController.eliminarComentario);


export default router;
