import { Router } from "express";
import { createTicket, getTickets, updateTicket, deleteTicket ,getTicketporRut ,getTicketporTareaID, getTareaSinTicket, getTareaConTicket} from "../controllers/ticket.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor, isAdmin} from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

router.post('/', createTicket , isSupervisor);
router.get('/', getTickets , isSupervisor);
router.put('/task/:id', updateTicket, isSupervisor);
router.delete('/:id', deleteTicket, isAdmin);
router.get('/user/:rut', getTicketporRut , isSupervisor);
router.get('/task/:id', getTicketporTareaID , isSupervisor);
router.get('/tasks', getTareaConTicket , isSupervisor);
router.get('/tasks/empty', getTareaSinTicket , isSupervisor);

export default router;