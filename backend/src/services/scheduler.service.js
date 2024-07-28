import cron from 'node-cron';
import TareaRealizada from '../models/tareaRealizada.model.js';
import Ticket from '../models/ticket.model.js';

// Función para marcar tareas no realizadas
const marcarTareasNoRealizadas = async () => {
    try {
        const now = new Date();
        const tickets = await Ticket.find({ Fin: { $lt: now } });

        for (const ticket of tickets) {
            const tareaRealizada = await TareaRealizada.findOne({ tarea: ticket.TareaID, ticket: ticket.RutAsignado });

            if (!tareaRealizada) {
                const nuevaTareaNoRealizada = new TareaRealizada({
                    tarea: ticket.TareaID,
                    ticket: ticket.RutAsignado,
                    estado: 'no realizada',
                    comentario: 'Tarea no realizada en el tiempo establecido'
                });

                await nuevaTareaNoRealizada.save();
                console.log(`Tarea ${ticket.TareaID} marcada como no realizada.`);
            }
        }
    } catch (error) {
        console.error('Error al marcar tareas no realizadas:', error);
    }
};

// Programar tarea para que se ejecute cada día a medianoche
cron.schedule('0 0 * * *', () => {
    console.log('Ejecutando tarea programada para marcar tareas no realizadas');
    marcarTareasNoRealizadas();
});

export default marcarTareasNoRealizadas;
