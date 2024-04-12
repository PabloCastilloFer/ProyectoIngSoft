import express from "express";
const router = express.Router();
import { tareaRealizaController } from "../controllers/tareaRealizada.controller.js";


router.post("/tareaRealizada", tareaRealizaController.crearTareaRealizada);
router.get("/tareaRealizada", tareaRealizaController.obtenerTareasRealizadas);
export default router;
