const express = require('express');
const router = express.Router();
const generarPDFController = require('../controllers/generarPDF.controller');

// Definir rutas para la generación de PDF
router.post('/', generarPDFController.generarPDF);
router.get('/info', generarPDFController.obtenerInformacionParaPDF);

module.exports = router;
