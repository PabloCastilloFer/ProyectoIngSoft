import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit-table';
import Comentario from '../models/comentario.model.js';
import Tarea from '../models/tarea.model.js'; // Asegúrate de importar el modelo Tarea
import { v4 as uuidv4 } from 'uuid';

// Obtener __dirname equivalente para ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createTable(req, res) {
  try {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const comentarios = await Comentario.find().populate('tarea', 'nombreTarea descripcionTarea estado');

    const randomFileName = uuidv4();
    const filePath = path.join(__dirname, '../Pdf', `${randomFileName}.pdf`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const table = {
      title: { label: 'Reporte de Comentarios', color: 'blue' },
      headers: ['Supervisor', 'Rut Empleado', 'Tarea', 'Descripción Tarea', 'Estado', 'Comentario'],
      rows: comentarios.map(comentario => [
        comentario.supervisor,
        comentario.rutEmpleado,
        comentario.tarea?.nombreTarea ?? 'N/A',
        comentario.tarea?.descripcionTarea ?? 'N/A',
        comentario.tarea?.estado ?? 'N/A',
        comentario.comentario
      ]),
    };

    await doc.table(table, { width: 500 });
    doc.end();

    writeStream.on('finish', () => {
      res.download(filePath, 'reporte.pdf', (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).send('Error interno del servidor');
        } else {
          fs.unlinkSync(filePath);
        }
      });
    });

    writeStream.on('error', (err) => {
      console.error('Error al escribir el archivo:', err);
      res.status(500).send('Error interno del servidor');
    });
  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).send('Error interno del servidor');
  }
}
