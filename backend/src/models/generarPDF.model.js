// generarPDF.js

const PDFDocument = require('pdfkit');
const fs = require('fs');

function generarPDF(datos) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('reporte.pdf'));

  // Agregar contenido al PDF basado en los datos proporcionados
  doc.text(datos);

  doc.end();
}

module.exports = generarPDF;
