import express from "express";
import { PDFController } from "./PDFController.js";

const router = express.Router();

router.get("/generate-pdf", PDFController.generatePDF);

export default router;
