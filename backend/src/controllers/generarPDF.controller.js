import express from 'express';
import { generatePDF } from '../utils/generarPDF.js';
import path from 'path';

const app = express();

// Ruta para generar el PDF
app.get('/generatePDF', async (req, res) => {
  try {
    const fileName = await generatePDF();
    const filePath = path.join(__dirname, '../Pdf', `${fileName}.pdf`);
    
    res.download(filePath, `${fileName}.pdf`, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).send('Error al descargar el archivo');
      }
      // Opcional: eliminar el archivo después de que se haya descargado
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error al eliminar el archivo:', err);
      });
    });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
});

export default app;