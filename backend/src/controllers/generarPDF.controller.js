"use strict";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Empleado from '../models/empleado.model.js';
import '../models/facultade.model.js';
import '../models/tarea.model.js';
import Ticket from '../models/ticket.model.js';
import '../models/user.model.js';

const calcularHorasTrabajadas = async (empleadoId) => {
  const tickets = await Ticket.find({ asignadoA: empleadoId }).populate('tareaId');

  let totalHoras = 0;
  tickets.forEach(ticket => {
    const [hInicio, mInicio, sInicio] = ticket.horaInicio.split(':').map(Number);
    const [hFin, mFin, sFin] = ticket.horaFin.split(':').map(Number);

    const inicio = new Date(1970, 0, 1, hInicio, mInicio, sInicio);
    const fin = new Date(1970, 0, 1, hFin, mFin, sFin);

    const diffMs = fin - inicio;
    const diffHoras = diffMs / (1000 * 60 * 60);

    totalHoras += diffHoras;
  });

  return totalHoras;
};

const generarPDF = async () => {
  try {
    const empleados = await Empleado.find().populate('facultad').populate('tareas').populate('usuario');

    for (const empleado of empleados) {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(`reporte_${empleado.nombre}.pdf`);
      doc.pipe(stream);

      // Título del reporte
      doc.fontSize(24).text('Empleado', { align: 'center' });
      doc.moveDown();

      // Fecha
      doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown();

      // Datos del empleado
      doc.fontSize(16).text(`Nombre: ${empleado.nombre}`);
      doc.fontSize(16).text(`RUT: ${empleado.rut}`);
      doc.fontSize(16).text(`Facultad: ${empleado.facultad.name}`);
      doc.moveDown();

      // Sección de tareas
      doc.fontSize(16).text('Tareas Realizadas:');
      empleado.tareas.forEach(tarea => {
        doc.fontSize(12).text(`Tarea: ${tarea.nombreTarea}`);
        doc.fontSize(12).text(`Descripción: ${tarea.descripcionTarea}`);
        doc.fontSize(12).text(`Tipo: ${tarea.tipoTarea}`);
        doc.fontSize(12).text(`Estado: ${tarea.estado}`);
        doc.fontSize(12).text(`Archivo: ${tarea.archivo}`);
        doc.fontSize(12).text(`Fecha de Creación: ${tarea.created_at.toISOString().split('T')[0]}`);
        doc.moveDown();
      });
      doc.moveDown();

      // Horas trabajadas
      const horasTrabajadas = await calcularHorasTrabajadas(empleado.usuario._id);
      doc.fontSize(16).text('Horas Trabajadas:');
      doc.fontSize(12).text(horasTrabajadas.toFixed(2));
      doc.moveDown();

      // Tabla de desempeño (simulada aquí como una lista, puede ser ajustada)
      doc.fontSize(16).text('Tabla de Desempeño:');
      doc.fontSize(12).text('Desempeño actual del empleado'); // Cambia esto según los datos reales
      doc.moveDown();

      doc.end();

      stream.on('finish', () => {
        console.log(`Reporte para ${empleado.nombre} generado con éxito.`);
      });
    }

  } catch (err) {
    console.error('Error al generar el reporte', err);
  }
};

generarPDF();

export { generarPDF };
