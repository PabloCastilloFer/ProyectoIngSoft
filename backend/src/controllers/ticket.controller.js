import Ticket from "../models/ticket.model.js";
import Tarea from '../models/tarea.model.js';
import sgMail from "@sendgrid/mail";
import { API_KEY } from "../config/configEnv.js";

// Crear un nuevo ticket
export const createTicket = async (req, res) => {
  const newTicket = new Ticket(req.body);
  try {

    // Verificar si ya existe un ticket con la misma tareaId
    const existingTicket = await Ticket.findOne({ TareaID: req.body.TareaID });
    if (existingTicket) {
      return res.status(400).json({ message: "Ya existe un ticket para esta tarea" });
    }

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
    const tarea = await Tarea.findOne({ idTarea: req.body.TareaID });
      if (!tarea) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }
      
      sgMail.setApiKey(API_KEY);
      const msg = {
        to: "luis.acuna2101@alumnos.ubiobio.cl",
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
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    // Verificar si se ha cambiado la asignación o el horario
    if (req.body.asignadoA !== ticket.asignadoA || req.body.hora !== ticket.hora) {
      // Agregar una nueva entrada al historial de asignaciones
      ticket.agregarAsignacion(req.body.asignadoA, new Date());
    }

    // Actualizar el ticket con los datos de la solicitud
    Object.assign(ticket, req.body);

    const updatedTicket = await ticket.save();
    res.status(200).json(updatedTicket);

    const tarea = await Tarea.findOne({ idTarea: req.body.tareaId });
      if (!tarea) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }

      sgMail.setApiKey(API_KEY);
      const msg = {
        to: "luis.acuna2101@alumnos.ubiobio.cl",
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
export const getTicketsByUserRut = async (req, res) => {
  try {
    const tickets = await Ticket.find({ 'usuarioRut': req.params.rut });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Obtener tickets por ID de tarea
export const getTicketsByTaskId = async (req, res) => {
  try {
    const tickets = await Ticket.find({ 'tareaId': req.params.id });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json(error);
  }
};

