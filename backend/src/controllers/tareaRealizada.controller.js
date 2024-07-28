import TareaRealizada from '../models/tareaRealizada.model.js';
import Tarea from '../models/tarea.model.js';
import Ticket from '../models/ticket.model.js';
import { HOST, PORT } from '../config/configEnv.js';
import { crearTareaRealizadaSchema } from '../schema/tareaRealizada.schema.js';
import sgMail from "@sendgrid/mail";
import { API_KEY } from "../config/configEnv.js";

// Crear una nueva tarea realizada
const crearTareaRealizada = async (req, res) => {
    try {
        console.log("Body de la solicitud:", req.body);
        console.log("Archivo adjunto:", req.file);

        const { error, value } = crearTareaRealizadaSchema.validate(req.body);
        if (error) {
            console.log("Error de validación:", error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { TareaID, comentario, estado } = value;
        if (!TareaID || !comentario || !estado) {
            console.log("Campos faltantes:", { TareaID, comentario, estado });
            return res.status(400).json({ message: 'Todos los campos son obligatorios: TareaID, comentario, estado' });
        }

        const ticket = await Ticket.findOne({ TareaID: TareaID, 'Historial.RutAsignado': req.params.rutUsuario });
        if (!ticket) {
            console.log("Tarea no asignada al usuario");
            return res.status(404).json({ message: 'Tarea no asignada al usuario' });
        }

        const tareaAsignada = ticket.Historial.find(historial => 
            historial.RutAsignado === req.params.rutUsuario && ticket.TareaID === TareaID
        );
        if (!tareaAsignada) {
            console.log("Tarea no asignada en el historial del usuario");
            return res.status(404).json({ message: 'Tarea no asignada en el historial del usuario' });
        }

        const tarea = await Tarea.findOne({ idTarea: TareaID });
        if (!tarea) {
            console.log("Tarea no encontrada");
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        const now = new Date();
        const inicio = new Date(ticket.Inicio);
        const fin = new Date(ticket.Fin);
        if (now < inicio) {
            console.log("Aun no comienza la tarea");
            return res.status(400).json({ message: 'Aun no comienza la tarea' });
        }
        if (now > fin) {
            console.log("Tarea después del plazo válido");
            return res.status(400).json({ message: 'Tarea después del plazo válido' });
        }

        const estadosPermitidos = ['completa', 'incompleta', 'no realizada'];
        if (!estadosPermitidos.includes(estado)) {
            console.log("Estado no válido:", estado);
            return res.status(400).json({ message: 'Estado no válido' });
        }

        const tareaRealizadaExistente = await TareaRealizada.findOne({ tarea: TareaID, ticket: ticket.RutAsignado });
        if (tareaRealizadaExistente) {
            console.log("Ya se ha respondido a esta tarea");
            return res.status(400).json({ message: 'Ya se ha respondido a esta tarea' });
        }

        const URL = `http://${HOST}:${PORT}/api/tareaRealizada/src/upload/`;
        const nuevaTareaRealizada = new TareaRealizada({
            tarea: TareaID,
            ticket: ticket.RutAsignado,
            archivoAdjunto: req.file ? URL + req.file.filename : null,
            estado: estado,
            comentario: comentario
        });

        const tareaRealizada = await nuevaTareaRealizada.save();
        console.log("Tarea realizada guardada:", tareaRealizada);

        tarea.estado = 'entregada';
        await tarea.save();
        console.log("Estado de la tarea actualizado a 'entregada'");

        const response = {
            id: tareaRealizada._id,
            tarea: {
                nombreTarea: tarea.nombreTarea,
                descripcionTarea: tarea.descripcionTarea,
                tipoTarea: tarea.tipoTarea,
            },
            ticket: {
                inicio: ticket.Inicio,
                fin: ticket.Fin,
            },
            estado: tareaRealizada.estado,
            comentario: tareaRealizada.comentario,
            archivoAdjunto: tareaRealizada.archivoAdjunto,
            fechaCreacion: tareaRealizada.createdAt,
        };

        sgMail.setApiKey(API_KEY);
        const msg = {
            to: "luis.acuna2101@alumnos.ubiobio.cl",
            from: "repondernttareas@gmail.com",
            subject: "Tarea Realizada",
            text: `Aviso de tarea realizada:\nnombre tarea: ${tarea.nombreTarea}\nEstado: ${tareaRealizada.estado}\nComentario: ${tareaRealizada.comentario}`,
        };

        sgMail
            .send(msg)
            .then(() => {
                console.log('Correo enviado');
            })
            .catch((error) => {
                console.error('Error al enviar el correo:', error);
            });

        res.status(201).json({
            message: 'Tarea realizada creada exitosamente',
            tareaRealizada: response
        });
    } catch (error) {
        console.error("Error al crear tarea realizada: ", error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud' });
    }
};

// Obtener todas las tareas realizadas
const obtenerTareasRealizadas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        console.log("Obteniendo tareas realizadas para el usuario:", rutUsuario);

        const tareasRealizadas = await TareaRealizada.find({ ticket: rutUsuario });

        if (tareasRealizadas.length === 0) {
            console.log("No se encontraron tareas realizadas");
            return res.status(404).json({ message: 'No se encontraron tareas realizadas' });
        }

        const tareasPromises = tareasRealizadas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });

            const result = {
                id: tareaRealizada._id,
                tarea: {
                    nombreTarea: tarea?.nombreTarea || 'Nombre no disponible',
                    descripcionTarea: tarea?.descripcionTarea || 'Descripción no disponible',
                    tipoTarea: tarea?.tipoTarea || 'Tipo no disponible',
                },
                ticket: {
                    inicio: ticket?.Inicio || null,
                    fin: ticket?.Fin || null,
                },
                estado: tareaRealizada.estado,
                comentario: tareaRealizada.comentario,
                archivoAdjunto: tareaRealizada.archivoAdjunto,
                fechaCreacion: tareaRealizada.createdAt,
            };
            console.log("Tarea con detalles:", result);
            return result;
        });

        const tareasConDetalles = await Promise.all(tareasPromises);

        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas realizadas: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas completas
const obtenerTareasCompletas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        console.log("Obteniendo tareas completas para el usuario:", rutUsuario);

        const tareasCompletas = await TareaRealizada.find({ estado: 'completa', ticket: rutUsuario });

        if (tareasCompletas.length === 0) {
            console.log("No se encontraron tareas completas para este usuario");
            return res.status(404).json({ message: 'No se encontraron tareas completas para este usuario' });
        }

        const tareasPromises = tareasCompletas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            if (!tarea) {
                console.log("No se encontró la tarea con idTarea:", tareaRealizada.tarea);
                return null;
            }

            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            if (!ticket) {
                console.log("No se encontró el ticket con RutAsignado:", tareaRealizada.ticket);
                return null;
            }

            const result = {
                id: tareaRealizada._id,
                tarea: {
                    nombreTarea: tarea.nombreTarea,
                    descripcionTarea: tarea.descripcionTarea,
                    tipoTarea: tarea.tipoTarea,
                },
                ticket: {
                    inicio: ticket.Inicio,
                    fin: ticket.Fin,
                },
                estado: tareaRealizada.estado,
                comentario: tareaRealizada.comentario,
                archivoAdjunto: tareaRealizada.archivoAdjunto,
                fechaCreacion: tareaRealizada.createdAt,
            };
            console.log("Tarea completa con detalles:", result);
            return result;
        });

        const tareasConDetalles = await Promise.all(tareasPromises.filter(tarea => tarea !== null));

        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas completas: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas incompletas
const obtenerTareasIncompletas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        console.log("Obteniendo tareas incompletas para el usuario:", rutUsuario);

        const tareasIncompletas = await TareaRealizada.find({ estado: 'incompleta', ticket: rutUsuario });

        if (tareasIncompletas.length === 0) {
            console.log("No se encontraron tareas incompletas");
            return res.status(404).json({ message: 'No se encontraron tareas incompletas' });
        }

        const tareasPromises = tareasIncompletas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            if (!tarea) {
                console.log("No se encontró la tarea con idTarea:", tareaRealizada.tarea);
                return null;
            }

            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            if (!ticket) {
                console.log("No se encontró el ticket con RutAsignado:", tareaRealizada.ticket);
                return null;
            }

            const result = {
                id: tareaRealizada._id,
                tarea: {
                    nombreTarea: tarea.nombreTarea,
                    descripcionTarea: tarea.descripcionTarea,
                    tipoTarea: tarea.tipoTarea,
                },
                ticket: {
                    inicio: ticket.Inicio,
                    fin: ticket.Fin,
                },
                estado: tareaRealizada.estado,
                comentario: tareaRealizada.comentario,
                archivoAdjunto: tareaRealizada.archivoAdjunto,
                fechaCreacion: tareaRealizada.createdAt,
            };
            console.log("Tarea incompleta con detalles:", result);
            return result;
        });

        const tareasConDetalles = await Promise.all(tareasPromises.filter(tarea => tarea !== null));

        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas incompletas: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas no realizadas
const obtenerTareasNoRealizadas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        console.log("Obteniendo tareas no realizadas para el usuario:", rutUsuario);

        const tareasNoRealizadas = await TareaRealizada.find({ estado: 'no realizada', ticket: rutUsuario });

        if (tareasNoRealizadas.length === 0) {
            console.log("No se encontraron tareas no realizadas");
            return res.status(404).json({ message: 'No se encontraron tareas no realizadas' });
        }

        const tareasPromises = tareasNoRealizadas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            if (!tarea) {
                console.log("No se encontró la tarea con idTarea:", tareaRealizada.tarea);
                return null;
            }

            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            if (!ticket) {
                console.log("No se encontró el ticket con RutAsignado:", tareaRealizada.ticket);
                return null;
            }

            const result = {
                id: tareaRealizada._id,
                tarea: {
                    nombreTarea: tarea.nombreTarea,
                    descripcionTarea: tarea.descripcionTarea,
                    tipoTarea: tarea.tipoTarea,
                },
                ticket: {
                    inicio: ticket.Inicio,
                    fin: ticket.Fin,
                },
                estado: tareaRealizada.estado,
                comentario: tareaRealizada.comentario,
                archivoAdjunto: tareaRealizada.archivoAdjunto,
                fechaCreacion: tareaRealizada.createdAt,
            };
            console.log("Tarea no realizada con detalles:", result);
            return result;
        });

        const tareasConDetalles = await Promise.all(tareasPromises.filter(tarea => tarea !== null));

        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas no realizadas: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas asignadas
const obtenerTareasAsignadas = async (req, res) => {
    try {
        const rutUsuario = req.params.rutUsuario;
        console.log("Obteniendo tareas asignadas para el usuario:", rutUsuario);

        // Encontrar todos los tickets asignados al usuario
        const ticketsAsignados = await Ticket.find({ RutAsignado: rutUsuario });
        console.log("Tickets asignados:", ticketsAsignados);

        // Verificar si se encontraron tickets asignados
        if (ticketsAsignados.length === 0) {
            console.log("No se encontraron tareas asignadas para este usuario");
            return res.status(404).json({ message: 'No se encontraron tareas asignadas para este usuario' });
        }

        // Crear una lista de promesas para obtener detalles de las tareas asignadas
        const tareasPromises = ticketsAsignados.map(async ticket => {
            // Obtener la tarea asociada al ticket
            console.log("Ticket:", ticket.TareaID);
            const tarea = await Tarea.findOne({ idTarea: ticket.TareaID });
            if (!tarea) {
                console.log("No se encontró la tarea con idTarea:", ticket.TareaID);
                return null;
            }
            return {
                idTarea: tarea.idTarea,
                nombreTarea: tarea.nombreTarea,
                descripcionTarea: tarea.descripcionTarea,
                tipoTarea: tarea.tipoTarea,
                estadoTarea: tarea.estado,
                archivo: tarea.archivo,
                fechaCreacionTarea: tarea.created_at,
                inicio: ticket.Inicio,
                fin: ticket.Fin
            };
        });

        // Esperar a que todas las promesas se resuelvan
        const tareasAsignadas = await Promise.all(tareasPromises.filter(tarea => tarea !== null));
        console.log("Tareas asignadas:", tareasAsignadas);

        // Enviar la respuesta con las tareas asignadas y sus detalles
        res.status(200).json(tareasAsignadas);
    } catch (error) {
        console.error("Error al obtener tareas asignadas: ", error);
        res.status(500).json({ message: error.message });
    }
};

const contarTareasCompletasPorEmpleador = async (rutEmpleador) => {
    try {
        console.log("Valor de rutEmpleador:", rutEmpleador);
        const tareasRealizadas = await TareaRealizada.find({ ticket: rutEmpleador });
        console.log("Tareas realizadas:", tareasRealizadas);
        let contador = 0;
        tareasRealizadas.forEach(tareaRealizada => {
            console.log("Estado de la tarea realizada:", tareaRealizada.estado);
            if (tareaRealizada.estado === "completa") {
                contador++;
            }
        });

        return contador;
    } catch (error) {
        console.error("Error al contar las tareas Completas por el empleador: ", error);
        throw new Error("Error al contar las tareas Completas por el empleador");
    }
};

export { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareasAsignadas, obtenerTareasCompletas, obtenerTareasIncompletas, obtenerTareasNoRealizadas };
