import express from "express";
import { ComentarioController } from "../controllers/comentario.controller.js";

const router = express.Router();

// Endpoint para dejar un comentario sobre el desempeño de un empleado
router.post("/comentario", ComentarioController.createComentario);

export default router;
