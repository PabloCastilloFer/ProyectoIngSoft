"use strict";
import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import '../models/facultade.model.js';
import tareaRealizada from '../models/tareaRealizada.model.js';
import Ticket from '../models/ticket.model.js';
import User from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid'; // Importar uuid para generar nombres de archivo únicos

async function generatePDF() {
  // Se crea la instancia del PDF
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  // Obtener datos
  const [dataUser, dataTicket, dataComment, dataTask] = await Promise.all([dataUser(), dataTicket(), dataComment(), dataTask()]);

  // Generar un nombre de archivo aleatorio
  const randomFileName = uuidv4();
  const filePath = `./src/Pdf/${randomFileName}.pdf`;

  // Canalizar el documento a un flujo escribible
  doc.pipe(fs.createWriteStream(filePath));

  // Definir el contenido de la tabla
  const table = {
    title: { label: 'Informe de rendimiento', color: 'blue' },
    headers: ['Nombre', 'RUT', 'Email', 'Rol (nombre)', 'Cantidad de horas trabajadas', 'Tareas realizadas', 'Comentarios'],
    rows: []
  };

  // Información del usuario en la constante table.rows
  dataUser.forEach(user => {
    table.rows.push([user.username, user.rut, user.email, user.rol, null, null, null]);
  });

  // Información de las horas trabajadas
  dataTicket.forEach(ticket => {
    // Suponiendo que ticket.horasTrabajadas ya está calculado, de lo contrario, calcularlo
    const hoursWorked = calculateHoursWorked(ticket);
    table.rows.push([null, null, null, null, hoursWorked, null, null]);
  });

  // Información de los comentarios
  dataComment.forEach(comment => {
    table.rows.push([null, null, null, null, null, null, comment.comentario]);
  });

  // Información de las tareas realizadas
  dataTask.forEach(task => {
    table.rows.push([null, null, null, null, null, task.taskTotal, null]);
  });

  // Dibujar la tabla
  await doc.table(table, { startY: 50 });

  // Finalizar el documento
  doc.end();
}

function calculateHoursWorked(ticket) {
  // Función placeholder para calcular las horas trabajadas a partir de los datos del ticket
  // Ejemplo: devolver la diferencia en horas entre dos fechas
  // Suponiendo que el ticket tiene 'startDate' y 'endDate'
  const startDate = new Date(ticket.startDate);
  const endDate = new Date(ticket.endDate);
  const diffMs = endDate - startDate;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return diffHours;
}

async function dataUser() {
  // Función placeholder para obtener datos de usuario
  return User.find().exec();
}

async function dataTicket() {
  // Función placeholder para obtener datos de ticket
  return Ticket.find().exec();
}

async function dataComment() {
  // Función placeholder para obtener datos de comentario
  return Comentario.find().exec();
}

async function dataTask() {
  // Función placeholder para obtener datos de tareas
  return TareaRealizada.find().exec();
}

generatePDF().then(() => {
  console.log('PDF generado con éxito');
}).catch(error => {
  console.error('Error al generar el PDF:', error);
});