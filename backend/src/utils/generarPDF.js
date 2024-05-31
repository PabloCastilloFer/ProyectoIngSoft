import User from '../models/user.model.js';
import Ticket from '../models/ticket.model.js';
import Comentario from '../models/comentario.model.js';
import TareaRealizada from '../models/tarea.model.js';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

async function dataUser() {
  try {
    return await User.find().exec();
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
}

async function dataTicket() {
  try {
    return await Ticket.find().exec();
  } catch (error) {
    console.error('Error al obtener los datos del ticket:', error);
    throw error;
  }
}

async function dataComment() {
  try {
    return await Comentario.find().exec();
  } catch (error) {
    console.error('Error al obtener los datos del comentario:', error);
    throw error;
  }
}

async function dataTask() {
  try {
    return await TareaRealizada.find().exec();
  } catch (error) {
    console.error('Error al obtener los datos de la tarea realizada:', error);
    throw error;
  }
}

export async function generatePDF(req, res) {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  let dataUserResults, dataTicketResults, dataCommentResults, dataTaskResults;
  try {
    [dataUserResults, dataTicketResults, dataCommentResults, dataTaskResults] = await Promise.all([
      dataUser(),
      dataTicket(),
      dataComment(),
      dataTask()
    ]);
  } catch (error) {
    return res.status(500).send('Error al obtener los datos');
  }

  const randomFileName = uuidv4();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const directoryPath = path.join(__dirname, '../Pdf');
  const filePath = path.join(directoryPath, `${randomFileName}.pdf`);

  // AsegÃºrate de que el directorio exista
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  const table = {
    title: { label: 'Informe de rendimiento', color: 'blue' },
    headers: ['Nombre', 'RUT', 'Email', 'Rol (nombre)', 'Cantidad de horas trabajadas', 'Tareas realizadas', 'Comentarios'],
    rows: []
  };

  dataUserResults.forEach(user => {
    const roles = user.roles.map(role => role.name).join(', ') || 'N/A';
    table.rows.push([user.username, user.rut, user.email, roles, '', '', '']);
  });

  dataTicketResults.forEach(ticket => {
    const hoursWorked = calculateHoursWorked(ticket);
    table.rows.push(['', '', '', '', hoursWorked, '', '']);
  });

  dataCommentResults.forEach(comment => {
    table.rows.push(['', '', '', '', '', '', comment.comentario]);
  });

  dataTaskResults.forEach(task => {
    table.rows.push(['', '', '', '', '', task.tarea, '']);
  });

  try {
    await doc.table(table, { startY: 50 });
  } catch (error) {
    console.error('Error al crear la tabla PDF:', error);
    return res.status(500).send('Error al crear el PDF');
  }

  doc.end();

  // Espera a que el archivo se haya escrito completamente antes de proceder a la descarga
  writeStream.on('finish', () => {
    res.download(filePath, `${randomFileName}.pdf`, err => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).send('Error al descargar el archivo');
      }
    });
  });

  writeStream.on('error', err => {
    console.error('Error al escribir el archivo:', err);
    res.status(500).send('Error al escribir el archivo');
  });
}

function calculateHoursWorked(ticket) {
  const startDate = new Date(ticket.Inicio);
  const endDate = new Date(ticket.Fin);
  const diffMs = endDate - startDate;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return diffHours;
}