import cron from 'node-cron';
import TareaRealizada from '../models/tareaRealizada.model.js';
import Ticket from '../models/ticket.model.js';
import Tarea from '../models/tarea.model.js'; // Importar el modelo Tarea
import sgMail from "@sendgrid/mail";
import { API_KEY } from "../config/configEnv.js";

// Configurar la API key de SendGrid
sgMail.setApiKey(API_KEY);

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

                // Enviar correo al supervisor
                const tarea = await Tarea.findOne({ idTarea: ticket.TareaID });
                if (tarea && tarea.userEmail) {
                    console.log("Correo del supervisor:", tarea.userEmail); // Log del correo del supervisor
                    const msg = {
                        to: tarea.userEmail, // Correo del supervisor
                        from: "repondernttareas@gmail.com",
                        subject: "Tarea No Realizada",
                        text: `La tarea con nombre: ${tarea.nombreTarea} no se ha respondido en el tiempo correspondiente. Comentario: ${nuevaTareaNoRealizada.comentario}`,
                    };

                    sgMail
                        .send(msg)
                        .then(() => {
                            console.log('Correo enviado al supervisor');
                        })
                        .catch((error) => {
                            console.error('Error al enviar el correo:', error);
                        });
                } else {
                    console.log("Correo del supervisor no encontrado o tarea no encontrada.");
                }
            }
        }
    } catch (error) {
        console.error('Error al marcar tareas no realizadas:', error);
    }
};

// Programar tarea para que se ejecute cada minuto (o ajusta según necesites)
cron.schedule('* * * * *', () => {
    console.log('Ejecutando tarea programada para marcar tareas no realizadas');
    marcarTareasNoRealizadas();
});

export default marcarTareasNoRealizadas;
