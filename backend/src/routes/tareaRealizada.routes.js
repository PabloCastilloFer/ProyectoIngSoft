import { Router } from "express";
const router = Router();
import { crearTareaRealizada, obtenerTareasRealizadas } from "../controllers/tareaRealizada.controller.js";

router.post("/", crearTareaRealizada);
router.get("/", obtenerTareasRealizadas);

export default router;