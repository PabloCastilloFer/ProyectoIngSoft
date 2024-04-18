import { Router } from "express";
import { asignarTicket , desasignarTicket , verTicketAsignado , verTicketAsignados , verTicketPorTareaId } from "../controllers/ticket.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor, isEmpleado } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

router.post('/', isSupervisor, asignarTicket); //funciona, pero poder asignar a cualquier usuario aun teniendo uno asignado
router.put('/:id', isSupervisor, desasignarTicket); //mirar
router.get('/:id', isSupervisor, verTicketAsignado); //ni idea
router.get('/', isSupervisor, verTicketAsignados); //no se si funciona, ya que supervisor no tiene nada
router.get('/:id', isSupervisor, verTicketPorTareaId); //nobusca

export default router;