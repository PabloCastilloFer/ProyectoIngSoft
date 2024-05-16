import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit-table';
import Report from '../models/generarPDF.model.js';
import { v4 as uuidv4 } from 'uuid';

// Obtener __dirname equivalente para ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createTable(req, res) {
    try {
        // Se crea la instancia del pdf
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        // Obtiene los datos del reporte
        const reports = await Report.find();

        // Generar un nombre de archivo aleatorio
        const randomFileName = uuidv4();
        const filePath = path.join(__dirname, '..', 'Pdf', `${randomFileName}.pdf`);

        // pipe the document to a writable stream
        doc.pipe(fs.createWriteStream(filePath));

        // Se define el contenido de la tabla
        const table = {
            title: { label: 'Reporte', color: 'blue' },
            headers: ['Email', 'Mensaje'], // Cambié los nombres de las columnas
            rows: reports.map(report => [report.email, report.message]), // Asume que report tiene campos email y message
        };

        // Añadir la tabla al documento
        await doc.table(table, {
            width: 500,
        });

        // Finaliza el documento
        doc.end();

        // Espera a que el archivo se escriba completamente antes de enviarlo
        doc.on('end', () => {
            res.download(filePath, 'reporte.pdf', (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).send('Error interno del servidor');
                } else {
                    // Elimina el archivo después de enviarlo
                    fs.unlinkSync(filePath);
                }
            });
        });
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).send('Error interno del servidor');
    }
}
