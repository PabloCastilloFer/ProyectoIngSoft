import User from '../models/user.model.js';
import Ticket from '../models/ticket.model.js';
import Comentario from '../models/comentario.model.js';
import TareaRealizada from '../models/tareaRealizada.model.js';
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
    const tareasRealizadas = await TareaRealizada.find().exec();
    return tareasRealizadas;
  } catch (error) {
    console.error('Error al obtener los datos de la tarea realizada:', error);
    throw error;
  }
}

const contarTareasPorEstadoPorEmpleador = async (rutEmpleador) => {
  try {
    const tareasRealizadas = await TareaRealizada.find({ ticket: rutEmpleador });
    let tareasCompletas = 0;
    let tareasIncompletas = 0;

    tareasRealizadas.forEach(tareaRealizada => {
      if (tareaRealizada.estado === "completa") {
        tareasCompletas++;
      } else if (tareaRealizada.estado === "incompleta") {
        tareasIncompletas++;
      }
    });

    return { tareasCompletas, tareasIncompletas };
  } catch (error) {
    console.error("Error al contar las tareas por estado por el empleador: ", error);
    throw new Error("Error al contar las tareas por estado por el empleador");
  }
};


export async function generatePDF(req, res) {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  let dataUserResults, dataTicketResults, dataCommentResults, TareaRealizada;
  try {
    [dataUserResults, dataTicketResults, dataCommentResults, TareaRealizada] = await Promise.all([
      dataUser(),
      dataTicket(),
      dataComment(),
      dataTask()
    ]);
  } catch (error) {
    return res.status(500).send('Error al obtener los datos');
  }
  console.log('Data de usuario:', dataUserResults);
  console.log('Data de tickets:', dataTicketResults);
  console.log('Data de comentarios:', dataCommentResults);
  console.log('Data de tareas realizadas:', TareaRealizada);

    

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
    headers: ['Nombre', 'RUT', 'Email', 'Rol (nombre)', 'Cantidad de horas trabajadas', 'Tareas completas', 'Tareas incompletas', 'Comentarios'],
    rows: []
  };

  for (const user of dataUserResults) {
    const roles = user.roles.map(role => role.name).join(', ') || 'N/A';
    const hoursWorked = await calculateHoursWorkedForUser(user);
    const { tareasCompletas, tareasIncompletas } = await contarTareasPorEstadoPorEmpleador(user.rut);
    const comentarios = dataCommentResults.filter(comentario => comentario.rutAsignado === user.rut).map(comentario => comentario.comentario).join(', ') || 'N/A';
    table.rows.push([user.username, user.rut, user.email, roles, hoursWorked, tareasCompletas, tareasIncompletas, comentarios]);
  }




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
        console.log(`Tickets asignados a ${user.rut}:`, userTickets); // Agregar console.log aquí
        userTickets.forEach(ticket => {
            const hoursWorked = calculateHoursWorked(ticket.Inicio, ticket.Fin);
            console.log(`Horas trabajadas para el ticket ${ticket._id}: ${hoursWorked}`); // Agregar console.log aquí
            totalHours += hoursWorked;
        });
    }
    return totalHours;
}
  
  function calculateHoursWorked(startDate, endDate) {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    // Establecer las horas de inicio y fin del horario laboral
    const startWorkingHour = 8; // 08:00 horas
    const endWorkingHour = 18; // 18:00 horas

    // Calcular la fecha y hora de inicio y fin dentro del horario laboral
    const startInsideWorkingHours = new Date(startDateTime);
    startInsideWorkingHours.setHours(Math.max(startDateTime.getHours(), startWorkingHour), 0, 0, 0);
    const endInsideWorkingHours = new Date(endDateTime);
    endInsideWorkingHours.setHours(Math.min(endDateTime.getHours(), endWorkingHour), 0, 0, 0);

    // Calcular la diferencia en horas dentro del horario laboral
    const diffMs = endInsideWorkingHours - startInsideWorkingHours;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    return diffHours >= 0 ? diffHours : 0;
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

