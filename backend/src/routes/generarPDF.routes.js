import express from "express";
import { PDFController } from "../controllers/generarPDF.controller.js";

const router = express.Router();

// Ruta para generar el PDF de un empleado por su ID
router.get("/pdf/empleado", PDFController.generarPDF);

export default router;
