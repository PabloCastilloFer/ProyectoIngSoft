import { Router } from "express";
import { createTicket, getTickets, updateTicket, deleteTicket ,getTicketporRut ,getTicketporTareaID, getTareaSinTicket, getTareaConTicket} from "../controllers/ticket.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor } from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

router.post('/',isSupervisor, createTicket);
router.get('/',isSupervisor, getTickets);
router.put('/tarea/:id',isSupervisor, updateTicket);
router.delete('/:id', isSupervisor, deleteTicket);
router.get('/user/:rut',isSupervisor, getTicketporRut);
router.get('/tarea/:id',isSupervisor, getTicketporTareaID);
router.get('/tareas',isSupervisor, getTareaConTicket);
router.get('/tareas/NoAsignadas',isSupervisor, getTareaSinTicket );

export default router;