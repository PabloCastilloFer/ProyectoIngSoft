import express from 'express';
import { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareaRealizadaPorId, actualizarTareaRealizada, eliminarTareaRealizada } from '../controllers/tareasRealizadas';

const router = express.Router();

// Rutas CRUD para tareas realizadas
router.post('/', crearTareaRealizada);
router.get('/', obtenerTareasRealizadas);
router.get('/:id', obtenerTareaRealizadaPorId);
router.put('/:id', actualizarTareaRealizada);
router.delete('/:id', eliminarTareaRealizada);

export default router;
