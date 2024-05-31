"use strict";

import { generatePDF } from '../utils/generarPDF.js';
import { Router } from 'express';
const router = Router(); 

router.get('/', async (req, res) => {
    try {
      await generatePDF();
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error al generar el PDF');
      }
});

export default router;