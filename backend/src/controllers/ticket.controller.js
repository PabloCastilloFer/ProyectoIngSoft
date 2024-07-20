import Ticket from "../models/ticket.model.js";
import Tarea from '../models/tarea.model.js';
import Usuario from '../models/user.model.js';
import sgMail from "@sendgrid/mail";
import { API_KEY } from "../config/configEnv.js";

// Función para validar si una fecha está dentro de los días laborables y el horario de trabajo
function isValidDate(date) {
  const dayOfWeek = date.getUTCDay();
  const hour = date.getUTCHours();

  // Verificar si el día de la semana es entre lunes (1) y viernes (5)
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    return false;
  }

  // Verificar si la hora está entre 8 a.m. y 6 p.m.
  if (hour < 8 || hour > 18) {
    return false;
  }

  return true;
}

// Crear un nuevo ticket
export const createTicket = async (req, res) => {
  const newTicket = new Ticket(req.body);
  try {

    const tarea = await Tarea.findOne({ idTarea: req.body.TareaID });
      if (!tarea) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const existingTicket = await Ticket.findOne({ TareaID: req.body.TareaID });
    if (existingTicket) {
      return res.status(400).json({ message: "Ya existe un ticket para esta tarea" });
    }

    const inicio = new Date(req.body.Inicio);
    const now = new Date();
    if (inicio <= now || !isValidDate(inicio)) {
      return res.status(400).json({ message: "La fecha de inicio de la tarea debe ser en el futuro y dentro de los días laborables y el horario de trabajo" });
    }

    const fin = new Date(req.body.Fin);
    if (fin <= inicio || !isValidDate(fin)) {
      return res.status(400).json({ message: "La fecha de fin de la tarea debe ser después de la fecha de inicio y dentro de los días laborables y el horario de trabajo" });
    }

    const overlappingTicket = await Ticket.findOne({
      RutAsignado: req.body.RutAsignado,
      $or: [
        { Inicio: { $gte: inicio, $lt: fin } },
        { Fin: { $gt: inicio, $lte: fin } },
      ],
    });
    if (overlappingTicket) {
      return res.status(400).json({ message: "Ya existe un ticket para esta persona en el mismo horario" });
    }

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);

    tarea.estado = "asignada";
    await tarea.save();

    const usuario = await Usuario.findOne({ rut: req.body.RutAsignado });

      sgMail.setApiKey(API_KEY);
      const msg = {
        to: usuario.email,
        from: "repondernttareas@gmail.com",
        subject: "Tarea Asignada",
        text: `Aviso de tarea asignada: ${tarea.nombreTarea}\nDescripción: ${tarea.descripcionTarea}`,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log('Correo enviado');
        })
        .catch((error) => {
          console.error('Error al enviar el correo:', error);
        });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Obtener todos los tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Actualizar un ticket por ID
export const updateTicket = async (req, res) => {
  try {
    // Buscar el ticket que se va a actualizar
    const ticket = await Ticket.findOne({ 'TareaID': req.params.id });
    if (!ticket) {
      return res.status(400).json({ message: "Ticket no encontrado" });
    }

    const tarea = await Tarea.findOne({ idTarea: req.body.TareaID });
    if (!tarea) {
      return res.status(400).json({ message: "Tarea no encontrada" });
    }

    // Verificar si se ha cambiado la asignación o el horario
    if (req.body.RutAsignado !== ticket.RutAsignado || req.body.hora !== ticket.hora) {
      // Agregar una nueva entrada al historial de asignaciones
      ticket.agregarAsignacion(req.body.RutAsignado, new Date());
    }

    const inicio = new Date(req.body.Inicio);
    const now = new Date();
    if (inicio <= now || !isValidDate(inicio)) {
      return res.status(400).json({ message: "La fecha de inicio de la tarea debe ser en el futuro, entre lunes a viernes y dentro del horario de trabajo" });
    }

    const fin = new Date(req.body.Fin);
    if (fin <= inicio || !isValidDate(fin)) {
      return res.status(400).json({ message: "La fecha de fin de la tarea debe ser después de la fecha de inicio, entre lunes a viernes y dentro del horario de trabajo" });
    }

    const overlappingTicket = await Ticket.findOne({
      RutAsignado: req.body.RutAsignado,
      $or: [
        { Inicio: { $gte: inicio, $lt: fin } },
        { Fin: { $gt: inicio, $lte: fin } },
      ],
    });
    if (overlappingTicket) {
      return res.status(400).json({ message: "Ya existe un ticket para esta persona en el mismo horario" });
    }

    // Actualizar el ticket con los datos de la solicitud
    Object.assign(ticket, req.body);

    const updatedTicket = await ticket.save();
    res.status(200).json(updatedTicket);

    tarea.estado = "asignada";
    await tarea.save();
    
    const usuario = await Usuario.findOne({ rut: req.body.RutAsignado });

      sgMail.setApiKey(API_KEY);
      const msg = {
        to: usuario.email,
        from: "repondernttareas@gmail.com",
        subject: "Tarea Asignada",
        text: `Aviso de tarea asignada: ${tarea.nombreTarea}\nDescripción: ${tarea.descripcionTarea}`,
      };

      
      sgMail
        .send(msg)
        .then(() => {
          console.log('Correo enviado');
        })
        .catch((error) => {
          console.error('Error al enviar el correo:', error);
        });

  } catch (error) {
    res.status(500).json(error);
  }
};

// Eliminar un ticket por ID
export const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json("Ticket eliminado con éxito");
  } catch (error) {
    res.status(500).json(error);
  }
};

// Obtener tickets asignados a un usuario específico por RUT
export const getTicketporRut = async (req, res) => {
  try {
    const tickets = await Ticket.find({ 'RutAsignado': req.params.rut });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Obtener tickets por ID de tarea
export const getTicketporTareaID = async (req, res) => {
  try {
    const tickets = await Ticket.find({ 'TareaID': req.params.id });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Listar todas las tareas con al menos un ticket
export const getTareaConTicket = async (req, res) => {
  try {
    // Realizar una consulta agregada para unir las colecciones
    const tareaConTicket = await Tarea.aggregate([
      {
        $lookup: {
          from: "tickets", // Asegúrate de que el nombre de la colección sea correcto
          localField: "idTarea", // El campo en la colección Tarea que se relaciona con Ticket
          foreignField: "TareaID", // El campo correspondiente en la colección Ticket
          as: "ticket" // El nombre del campo donde se almacenarán los tickets asociados
        }
      },
      {
        $match: {
          "ticket": { $ne: [] } // Filtrar para incluir solo las tareas con tickets asociados
        }
      }
    ]);

    res.status(200).json(tareaConTicket);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Listar todas las tareas sin tickets
export const getTareaSinTicket = async (req, res) => {
  try {
    // Buscar todos los tickets y extraer los TareaID únicos
    const tickets = await Ticket.find().distinct('TareaID');
    // Buscar tareas que no estén en esos TareaID
    const tareaSinTicket = await Tarea.find({ 'idTarea': { $nin: tickets } });
    res.status(200).json(tareaSinTicket);
  } catch (error) {
    res.status(500).json(error);
  }
};
