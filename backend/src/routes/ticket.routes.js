import { Router } from "express";
import { createTicket, getTickets, updateTicket, deleteTicket ,getTicketsByUserRut ,getTicketsByTaskId} from "../controllers/ticket.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import { isSupervisor, isAdmin, isEmpleado} from "../middlewares/authorization.middleware.js";

const router = Router();
router.use(authenticationMiddleware);

router.post('/', createTicket , isSupervisor);
router.get('/', getTickets , isSupervisor);
router.put('/task/:id', updateTicket, isSupervisor);
router.delete('/:id', deleteTicket, isAdmin);
router.get('/user/:rut', getTicketsByUserRut , isSupervisor);
router.get('/task/:id', getTicketsByTaskId , isSupervisor);

export default router;