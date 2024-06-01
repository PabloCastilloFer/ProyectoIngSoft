

import TareaRealizada from '../models/tareaRealizada.model.js';
import Tarea from '../models/tarea.model.js';
import Ticket from '../models/ticket.model.js';
//import user from '../models/user.model.js';

import { HOST, PORT } from '../config/configEnv.js';

// Crear una nueva tarea realizada

const crearTareaRealizada = async (req, res) => {
    try {
        // Extraer información de la solicitud
        const { tareaId, comentario, estado } = req.body;
        console.log("Valor de estado recibido:", estado); // Aquí se registra el valor de estado recibido
        const rutUsuario = req.params.rutUsuario;
        const URL = `http://${HOST}:${PORT}/api/tareaRealizada/src/upload/`;
        const archivoAdjunto = req.file.filename;
        

        // Verificar si la tarea está asignada al usuario
        const ticket = await Ticket.findOne({ 'asignadoHistorial.asignadoA': rutUsuario  });
        console.log("Ticket: ", ticket)
        if (!ticket) {
            return res.status(404).json({ message: 'Tarea no asignada al usuario' });
        }
        
        // Verificar si se está dentro del plazo
        const now = new Date();
        const inicio = new Date(ticket.Inicio);
        const fin = new Date(ticket.Fin);
        if (now < inicio || now > fin) {
            return res.status(400).json({ message: 'Tarea fuera de plazo' });
        }

        // Verificar si la tarea existe
        const tarea = await Tarea.findOne({ idTarea: tareaId });
        if (!tarea) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }


        const estadosPermitidos = ['completa', 'incompleta', 'no realizada'];
        console.log("Estados permitidos:", estadosPermitidos);
        console.log("Estado recibido:", estado);
        if (!estadosPermitidos.includes(estado)) {
            console.log("Estado no válido");
            return res.status(400).json({ message: 'Estado no válido' });
        } else {
            console.log("Estado válido");
        }

        // Crear nueva tarea realizada
        const nuevaTareaRealizada = new TareaRealizada({
            tarea: tareaId,
            ticket: ticket.asignadoA, // Utiliza el rut del usuario asignado al ticket
            comentario,
            archivoAdjunto:  URL + archivoAdjunto,
            estado:req.body.estado
        });

        // Guardar la tarea realizada
        const tareaRealizada = await nuevaTareaRealizada.save();

        // Actualizar estado de la tarea original
        //tarea.estado = estado;
        //await tarea.save();

        // Respuesta exitosa
        res.status(201).json({
            message: 'Tarea realizada creada exitosamente',
            tareaRealizada
        });
    } catch (error) {
        // Manejar errores
        res.status(500).json({ message: error.message });
    }
};


// Obtener todas las tareas realizadas
const obtenerTareasRealizadas = async (req, res) => {
    try {
        const tareasRealizadas = await TareaRealizada.find().populate('tarea').populate('ticket');
        res.status(200).json(tareasRealizadas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Obtener una tarea realizada por su ID
const obtenerTareaRealizadaPorId = async (req, res) => {
    const tareaRealizadaId = req.params.id;
    try {
        const tareaRealizada = await TareaRealizada.findById(tareaRealizadaId);
        if (!tareaRealizada) {
            return res.status(404).json({ message: 'Tarea realizada no encontrada' });
        }
        res.status(200).json(tareaRealizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareaRealizadaPorId };
