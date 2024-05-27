// routes/empleado.routes.js
import express from 'express';
import { getEmpleados, getEmpleadoById } from '../controllers/empleado.controller.js';

const router = express.Router();

router.get('/empleado', getEmpleados);
router.get('/empleado/:id', getEmpleadoById);

export default router;
