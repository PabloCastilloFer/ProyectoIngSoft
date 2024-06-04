import TareaRealizada from '../models/tareaRealizada.model.js';
import Tarea from '../models/tarea.model.js';
import Ticket from '../models/ticket.model.js';
import { HOST, PORT } from '../config/configEnv.js';
import {crearTareaRealizadaSchema} from '../schema/tareaRealizada.schema.js';

// Crear una nueva tarea realizada

const crearTareaRealizada = async (req, res) => {
    try {
        console.log("Body de la solicitud:", req.body);

        // Validar los datos de entrada utilizando el esquema Joi
        const { error, value } = crearTareaRealizadaSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Extraer información de la solicitud validada
        const { TareaID, comentario, estado } = value;

        // Verificar que todos los campos requeridos estén presentes
        if (!TareaID || !comentario || !estado) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: TareaID, comentario, estado' });
        }

        // Verificar si la tarea está asignada al usuario
        const ticket = await Ticket.findOne({ 'Historial.RutAsignado': req.params.rutUsuario });

        if (!ticket) {
            return res.status(404).json({ message: 'Tarea no asignada al usuario' });
        }

        // Verificar si se está dentro del plazo
        const now = new Date();
        const inicio = new Date(ticket.Inicio.$date);
        const fin = new Date(ticket.Fin.$date);

        if (now.getTime() < inicio.getTime()) {
            return res.status(400).json({ message: 'Aun no comienza la tarea' });
        }
        if (now.getTime() > fin.getTime()) {
            return res.status(400).json({ message: 'Tarea después del plazo valido' });
        }

        // Verificar si el estado es válido
        const estadosPermitidos = ['completa', 'incompleta', 'no realizada'];

        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        // Verificar si la tarea ya fue realizada
        const tareaRealizadaExistente = await TareaRealizada.findOne({ tarea: TareaID, ticket: ticket.RutAsignado });

        if (tareaRealizadaExistente) {
            return res.status(400).json({ message: 'Ya se ha respondido a esta tarea' });
        }

        // Crear nueva tarea realizada
        const URL = `http://${HOST}:${PORT}/api/tareaRealizada/src/upload/`;
        const nuevaTareaRealizada = new TareaRealizada({
            tarea: TareaID,
            ticket: ticket.RutAsignado,
            archivoAdjunto: req.file ? URL + req.file.filename : null,
            estado: estado,
            comentario: comentario
        });

        // Guardar la tarea realizada en la base de datos
        const tareaRealizada = await nuevaTareaRealizada.save();

        // Construir la respuesta
        const response = {
            id: tareaRealizada._id,
            tarea: {
                nombre: tareaRealizada.tarea.nombreTarea,
                descripcion: tareaRealizada.tarea.descripcionTarea,
                tipo: tareaRealizada.tarea.tipoTarea,
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

        // Respuesta exitosa
        res.status(201).json({
            message: 'Tarea realizada creada exitosamente',
            tareaRealizada: response
        });
    } catch (error) {
        console.error("Error al crear tarea realizada: ", error);

        // Si se produce un error, manejarlo adecuadamente
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud' });
    }
};




// Obtener todas las tareas realizadas

const obtenerTareasRealizadas = async (req, res) => {
    try {
        // Obtener todas las tareas realizadas
        const tareasRealizadas = await TareaRealizada.find();

        // Crear una lista de promesas para obtener las tareas y los tickets relacionados
        const tareasPromises = tareasRealizadas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            const contadorTareasCompletas = await contarTareasCompletasPorEmpleador(ticket.RutAsignado);
            return {
                id: tareaRealizada._id,
                tarea: {
                    nombre: tarea.nombreTarea,
                    descripcion: tarea.descripcionTarea,
                    tipo: tarea.tipoTarea,
                },
                ticket: {
                    inicio: ticket.Inicio,
                    fin: ticket.Fin,
                },
                estado: tareaRealizada.estado,
                comentario: tareaRealizada.comentario,
                archivoAdjunto: tareaRealizada.archivoAdjunto,
                contadorTareasCompletas,
                fechaCreacion: tareaRealizada.createdAt,
            };
        });
     
        // Esperar a que todas las promesas se resuelvan
        const tareasConDetalles = await Promise.all(tareasPromises);

        // Enviar la respuesta con las tareas realizadas y sus detalles
        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas realizadas: ", error);
        res.status(500).json({ message: error.message });
    }
};


const contarTareasCompletasPorEmpleador = async (rutEmpleador) => {
    try {
        console.log("Valor de rutEmpleador:", rutEmpleador);
        // Traer todas las tareas realizadas por el empleador utilizando el campo 'ticket' que contiene el RUT
        const tareasRealizadas = await TareaRealizada.find({ ticket: rutEmpleador });

        // Imprimir las tareas realizadas en la consola para verificar
        console.log("Tareas realizadas:", tareasRealizadas);

        // Contar las tareas incompletas realizadas por el empleador
        let contador = 0;
        tareasRealizadas.forEach(tareaRealizada => {
            console.log("Estado de la tarea realizada:", tareaRealizada.estado); // Imprime el estado de cada tarea realizada
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

const obtenerTareasCompletas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        // Encontrar todas las tareas completas para el usuario
        const tareasCompletas = await TareaRealizada.find({ estado: 'completa', ticket: rutUsuario });

        // Verificar si se encontraron tareas completas
        if (tareasCompletas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas completas para este usuario' });
        }

        // Crear una lista de promesas para obtener las tareas y los tickets relacionados
        const tareasPromises = tareasCompletas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            return {
                id: tareaRealizada._id,
                tarea: {
                    nombre: tarea.nombre,
                    descripcion: tarea.descripcion,
                    tipo: tarea.tipo,
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
        });

        // Esperar a que todas las promesas se resuelvan
        const tareasConDetalles = await Promise.all(tareasPromises);

        // Enviar la respuesta con las tareas completas y sus detalles
        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas completas: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas incompletas
const obtenerTareasIncompletas = async (req, res) => {
    try {
        // Encontrar todas las tareas incompletas
        const tareasIncompletas = await TareaRealizada.find({ estado: 'incompleta' });

        // Verificar si se encontraron tareas incompletas
        if (tareasIncompletas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas incompletas' });
        }

        // Crear una lista de promesas para obtener detalles de las tareas incompletas
        const tareasPromises = tareasIncompletas.map(async tareaRealizada => {
            // Obtener detalles de la tarea incompleta
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            return {
                id: tareaRealizada._id,
                tarea: {
                    nombre: tarea.nombre,
                    descripcion: tarea.descripcion,
                    tipo: tarea.tipo,
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
        });

        // Esperar a que todas las promesas se resuelvan
        const tareasConDetalles = await Promise.all(tareasPromises);

        // Enviar la respuesta con las tareas incompletas y sus detalles
        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas incompletas: ", error);
        res.status(500).json({ message: error.message });
    }
};


// Obtener tareas no realizadas
const obtenerTareasNoRealizadas = async (req, res) => {
    try {
        // Encontrar todas las tareas no realizadas
        const tareasNoRealizadas = await TareaRealizada.find({ estado: 'no realizada' });

        // Verificar si se encontraron tareas no realizadas
        if (tareasNoRealizadas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas no realizadas' });
        }

        // Crear una lista de promesas para obtener detalles de las tareas no realizadas
        const tareasPromises = tareasNoRealizadas.map(async tareaRealizada => {
            // Obtener detalles de la tarea no realizada
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tarea });
            const ticket = await Ticket.findOne({ RutAsignado: tareaRealizada.ticket });
            return {
                id: tareaRealizada._id,
                tarea: {
                    nombre: tarea.nombre,
                    descripcion: tarea.descripcion,
                    tipo: tarea.tipo,
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
        });

        // Esperar a que todas las promesas se resuelvan
        const tareasConDetalles = await Promise.all(tareasPromises);

        // Enviar la respuesta con las tareas no realizadas y sus detalles
        res.status(200).json(tareasConDetalles);
    } catch (error) {
        console.error("Error al obtener tareas no realizadas: ", error);
        res.status(500).json({ message: error.message });
    }
};

const obtenerTareasAsignadas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        // Encontrar todos los tickets asignados al usuario
        const ticketsAsignados = await Ticket.find({ RutAsignado: rutUsuario });

        // Verificar si se encontraron tickets asignados
        if (ticketsAsignados.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas asignadas para este usuario' });
        }

        // Crear una lista de promesas para obtener detalles de las tareas asignadas
        const tareasPromises = ticketsAsignados.map(async ticket => {
            // Obtener la tarea asociada al ticket
            const tarea = await Tarea.findOne({ idTarea: ticket.TareaID });
            return {
                idTarea: tarea.idTarea,
                nombreTarea: tarea.nombreTarea,
                descripcionTarea: tarea.descripcionTarea,
                tipoTarea: tarea.tipoTarea,
                estadoTarea: tarea.estado,
                archivo: tarea.archivo,
                fechaCreacionTarea: tarea.createdAt,
            };
        });

        // Esperar a que todas las promesas se resuelvan
        const tareasAsignadas = await Promise.all(tareasPromises);

        // Enviar la respuesta con las tareas asignadas y sus detalles
        res.status(200).json(tareasAsignadas);
    } catch (error) {
        console.error("Error al obtener tareas asignadas: ", error);
        res.status(500).json({ message: error.message });
    }
};

export { crearTareaRealizada, obtenerTareasRealizadas,obtenerTareasAsignadas,obtenerTareasCompletas,obtenerTareasIncompletas,obtenerTareasNoRealizadas };
