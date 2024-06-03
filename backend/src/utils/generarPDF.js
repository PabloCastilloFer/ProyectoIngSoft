import User from '../models/user.model.js';
import Ticket from '../models/ticket.model.js';
import Comentario from '../models/comentario.model.js';
import TareaRealizada from '../models/tarea.model.js';
import PDFDocument from 'pdfkit-table';
import Role from '../models/role.model.js'; 
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

async function dataUser() {
  try {
    // Encuentra el rol de empleado
    const employeeRole = await Role.findOne({ name: 'empleado' }).exec();
    if (!employeeRole) {
      throw new Error('Rol de empleado no encontrado');
    }
    // Encuentra los usuarios con el rol de empleado
    return await User.find({ roles: employeeRole._id }).populate('roles').exec();
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

  for (const user of dataUserResults) {
    const roles = user.roles.map(role => role.name).join(', ') || 'N/A';
    const hoursWorked = await calculateHoursWorkedForUser(user);
    table.rows.push([user.username, user.rut, user.email, roles, hoursWorked, '', '']);
  }

  dataTicketResults.forEach(ticket => {
    const hoursWorked = calculateHoursWorked(ticket.Inicio, ticket.Fin);
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

  async function calculateHoursWorkedForUser(user) {
    let totalHours = 0;
    if (dataTicketResults) {
      const userTickets = dataTicketResults.filter(ticket => ticket.RutAsignado === user.rut);
      userTickets.forEach(ticket => {
        totalHours += calculateHoursWorked(ticket.Inicio, ticket.Fin);
      });
    }
    return totalHours;
  }
  
  function calculateHoursWorked(startDate, endDate) {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);

    // Verificar si las fechas caen en un fin de semana
    if (startTime.getDay() === 0 || startTime.getDay() === 6 || endTime.getDay() === 0 || endTime.getDay() === 6) {
        return 0; // No se trabajan horas los fines de semana
    }

    // Establecer las horas de inicio y fin del horario laboral
    const startWorkingHour = 8; // 08:00 horas
    const endWorkingHour = 18; // 18:00 horas

    // Establecer la fecha y hora de inicio del día laborable
    const startOfDay = new Date(startTime);
    startOfDay.setHours(startWorkingHour, 0, 0, 0);

    // Establecer la fecha y hora de fin del día laborable
    const endOfDay = new Date(startTime);
    endOfDay.setHours(endWorkingHour, 0, 0, 0);

    let totalHours = 0;

    // Calcular las horas trabajadas para cada día laborable
    while (startOfDay < endTime) {
        // Calcular la fecha y hora de fin del día laborable actual
        endOfDay.setDate(endOfDay.getDate() + 1);

        // Calcular la hora de inicio y fin dentro del horario laboral
        const start = Math.max(startTime, startOfDay);
        const end = Math.min(endTime, endOfDay);

        // Calcular la diferencia de tiempo en milisegundos
        const diffMs = end - start;

        // Convertir la diferencia de tiempo a horas redondeadas
        const diffHours = Math.round(diffMs / (1000 * 60 * 60));

        // Agregar las horas trabajadas para este día laborable
        totalHours += diffHours;

        // Actualizar la fecha y hora de inicio del próximo día laborable
        startOfDay.setDate(startOfDay.getDate() + 1);
    }

    return totalHours;
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




