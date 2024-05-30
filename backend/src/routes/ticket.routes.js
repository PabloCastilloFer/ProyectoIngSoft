import { Router } from "express";
import { createTicket, getTickets, getTicket, updateTicket, deleteTicket ,getTicketsByUserRut ,getTicketsByTaskId} from "../controllers/ticket.controller.js";

const router = Router();

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.get('/user/:rut', getTicketsByUserRut);
router.get('/task/:id', getTicketsByTaskId);

export default router;