import { Router } from "express";
import { crearTarea , getTareas , deleteTarea , updateTarea } from "../controllers/tarea.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);


router.post('/', isSupervisor, crearTarea);
router.get('/', isSupervisor, getTareas);
router.delete('/:nombreTarea', isSupervisor, deleteTarea);
router.put('/:nombreTarea', isSupervisor, updateTarea);


export default router;