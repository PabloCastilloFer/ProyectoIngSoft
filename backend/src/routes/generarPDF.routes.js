// generarPDF.routes.js
import express from 'express';
const router = express.Router();
import { generarPDF } from '../controllers/generarPDF.controller.js'; // Import the function

router.post('/', generarPDF); // Use the imported function as the callback

export default router;
