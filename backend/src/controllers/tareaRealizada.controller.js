

import TareaRealizada from '../models/tareaRealizada.model.js';
import Tarea from '../models/tarea.model.js';
import Ticket from '../models/ticket.model.js';
import { HOST, PORT } from '../config/configEnv.js';





// Crear una nueva tarea realizada
const crearTareaRealizada = async (req, res) => {
    try {
        const { tareaId, comentario, estado } = req.body;
        const archivoAdjunto = req.file.filename;
        const URL = `http://${HOST}:${PORT}/api/tareaRealizada/src/upload/`;

        // Buscar el ticket asociado a la tarea y al usuario
        const ticket = await Ticket.findOne({ tarea: tareaId, asignadoA: req.user._id });

        if (!ticket) {
            return res.status(404).json({ message: 'Tarea asignada no encontrada' });
        }

        // Verificar que estamos dentro del plazo
        const now = new Date();
        if (now < new Date(ticket.Inicio) || now > new Date(ticket.Fin)) {
            return res.status(400).json({ message: 'Tarea asignada fuera de plazo' });
        }

        // Buscar la tarea asociada
        const tarea = await Tarea.findById(tareaId);

        if (!tarea) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Validar el estado de la tarea realizada
        const estadosPermitidos = ['completa', 'incompleta', 'no realizada'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido' });
        }

        const nuevaTareaRealizada = new TareaRealizada({
            tarea: tareaId,
            ticket: ticket._id,
            comentario,
            archivo: URL + archivoAdjunto,
            estado
        });

        const tareaRealizada = await nuevaTareaRealizada.save();

        // Actualizar el estado de la tarea original
        tarea.estado = estado;
        await tarea.save();

        res.status(201).json({
            message: 'Tarea realizada completada exitosamente',
            tareaRealizada
        });
    } catch (error) {
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
