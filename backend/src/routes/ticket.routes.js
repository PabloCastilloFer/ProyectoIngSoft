import { Router } from "express";
import { createTicket, getTickets, updateTicket, deleteTicket ,getTicketporRut ,getTicketporTareaID, getTareaSinTicket, getTareaConTicket} from "../controllers/ticket.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor, isAdmin} from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

router.post('/',isSupervisor, createTicket);
router.get('/',isSupervisor, getTickets);
router.put('/task/:id',isSupervisor, updateTicket);
router.delete('/:id', isAdmin, deleteTicket);
router.get('/user/:rut',isSupervisor, getTicketporRut);
router.get('/task/:id',isSupervisor, getTicketporTareaID);
router.get('/tasks',isSupervisor, getTareaConTicket);
router.get('/tasks/empty',isSupervisor, getTareaSinTicket );

export default router;