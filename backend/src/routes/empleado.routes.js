// routes/empleado.routes.js
import express from 'express';
import { getEmpleados, getEmpleadoById } from '../controllers/empleado.controller.js';

const router = express.Router();

router.get('/', getEmpleados);
router.get('/:id', getEmpleadoById);

export default router;
