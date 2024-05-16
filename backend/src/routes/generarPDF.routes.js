import express from 'express';
import { createTable } from '../controllers/generarPDF.controller.js';
import { isSupervisor } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.get('/generarReporte', isSupervisor, createTable);

export default router;
