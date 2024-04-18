import Ticket from "../models/ticket.model.js";
import Tarea from "../models/tarea.model.js";
import User from "../models/user.model.js";

export const asignarTicket = async (req, res) => {
  const { userId, inicio, fin } = req.body;
  const tareasSuperpuestas = await Ticket.find({
    asignadoA: userId,
    inicio: { $lt: fin },
    fin: { $gt: inicio }
  });
  if (tareasSuperpuestas.length > 0) {
    return res.status(400).send({ error: 'Ya existe una tarea asignada en el mismo horario.' });
  }  

//  const user = await User.findById(userId);
//  if (!user) {
//    return res.status(404).send({ error: 'Usuario no encontrado.' });
//  }
  
  const ticket = new Ticket(req.body);
  const tarea = await Tarea.findById(req.body.tareaId);
  if (!tarea) {
    return res.status(404).send({ error: 'Tarea no encontrada.' });
  }
  tarea.estado = 'asignada';
  await tarea.save();
  await ticket.save();
  res.status(201).send(ticket);
};

export const desasignarTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).send({ error: 'Asignación no encontrada.' });
  }
  const tiempoTranscurrido = Date.now() - ticket.createdAt;
  if (tiempoTranscurrido > 10 * 60 * 1000) { // 10 minutos en milisegundos
    return res.status(400).send({ error: 'No se puede desasignar la tarea después de 10 minutos.' });
  }
  
  const tarea = await Tarea.findById(ticket.tareaId);
  if (!tarea) {
    return res.status(404).send({ error: 'Tarea no encontrada.' });
  }
  tarea.estado = 'no asignada';
  await tarea.save();
  res.status(200).send({ message: 'Tarea desasignada con éxito.' });
};

export const verTicketAsignado = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id).populate('tareaId');
  if (!ticket) {
    return res.status(404).send();
  }
  res.send(ticket);
};

export const verTicketAsignados = async (req, res) => {
  const ticket = await Ticket.find({ asignadoA: req.params.asignadoA }).populate('tareaId');
  res.send(ticket);
};

export const verTicketPorTareaId = async (req, res) => {
    const ticket = await Ticket.findOne({ tareaId: req.params.id }).populate('tareaId');
    if (!ticket) {
      return res.status(404).send();
    }
    res.send(ticket);
};

export const eliminarTicket = async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).send({ error: 'Asignación no encontrada.' });
    }
    await ticket.remove();
    res.status(200).send({ message: 'Asignación eliminada con éxito.' });
  };