

import { generatePDF } from '../utils/generarPDF.js';

// Tu código de enrutamiento aquí

// Por ejemplo, una ruta para generar el PDF:
app.get('/', async (req, res) => {
  try {
    await generatePDF();
    res.download('./Pdf/8912fe5c-202e-4a10-98a2-702909f0c302.pdf')
    res.status(200).send('PDF generado con éxito');
  } catch (error) {
    res.status(500).send('Error al generar el PDF');
  }
});
