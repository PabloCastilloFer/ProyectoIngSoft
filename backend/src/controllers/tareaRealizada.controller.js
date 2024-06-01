

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

        // Verificar si la tarea ya fue realizada
        const tareaRealizadaExistente = await TareaRealizada.findOne({ ticket: ticket.asignadoA });
        if (tareaRealizadaExistente) {
            return res.status(400).json({ message: 'Ya se ha respondido a esta tarea' });
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
        // Obtener todas las tareas realizadas
        const tareasRealizadas = await TareaRealizada.find();

        // Crear una lista de promesas para obtener las tareas y los tickets relacionados
        const tareasPromises = tareasRealizadas.map(async tareaRealizada => {
            const tarea = await Tarea.findOne({ idTarea: tareaRealizada.tareaId });
            const ticket = await Ticket.findOne({ asignadoA: tareaRealizada.ticket });
            //const contadorTareasIncompletas = await contarTareasIncompletasPorEmpleador(ticket.asignadoA);
            return {
                ...tareaRealizada._doc,
                tarea,
                ticket,
                //contadorTareasIncompletas
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

/*const contarTareasIncompletasPorEmpleador = async (rutEmpleador) => {
    try {

      console.log("Valor de rutEmpleador:", rutEmpleador);
        // Traer todas las tareas realizadas por el empleador
        const tareasRealizadas = await TareaRealizada.find({ 'ticket.asignadoA': rutEmpleador });

        // Imprimir las tareas realizadas en la consola para verificar
        console.log("Tareas realizadas:", tareasRealizadas);

        // Contar las tareas incompletas realizadas por el empleador
        let contador = 0;
        tareasRealizadas.forEach(tareaRealizada => {
            console.log("Estado de la tarea realizada:", tareaRealizada.estado); // Imprime el estado de cada tarea realizada
            if (tareaRealizada.estado === "incompleta") {
                contador++;
            }
        });

        return contador;
    } catch (error) {
        console.error("Error al contar las tareas incompletas por el empleador: ", error);
        throw new Error("Error al contar las tareas incompletas por el empleador");
    }
};*/

const obtenerTareasCompletas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        const tareasCompletas = await TareaRealizada.find({ estado: 'completa', 'asignadoHistorial.asignadoA': rutUsuario });
        res.status(200).json(tareasCompletas);
    } catch (error) {
        console.error("Error al obtener tareas completas: ", error);
        res.status(500).json({ message: error.message });
    }
};
// Obtener tareas incompletas
const obtenerTareasIncompletas = async (req, res) => {
    try {
        const tareasIncompletas = await TareaRealizada.find({ estado: 'incompleta' });
        res.status(200).json(tareasIncompletas);
    } catch (error) {
        console.error("Error al obtener tareas incompletas: ", error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener tareas no realizadas
const obtenerTareasNoRealizadas = async (req, res) => {
    try {
        const tareasNoRealizadas = await TareaRealizada.find({ estado: 'no realizada' });
        res.status(200).json(tareasNoRealizadas);
    } catch (error) {
        console.error("Error al obtener tareas no realizadas: ", error);
        res.status(500).json({ message: error.message });
    }
};
const obtenerTareasAsignadas = async (req, res) => {
    const rutUsuario = req.params.rutUsuario;
    try {
        const tareasAsignadas = await TareaRealizada.find({ 'ticket.asignadoA': rutUsuario });
        // Extraer los nombres de las tareas asignadas
        const nombresTareasAsignadas = tareasAsignadas.map(tarea => tarea.nombreTarea); // Reemplaza "nombre" por el campo que contiene los nombres de las tareas
        res.status(200).json(nombresTareasAsignadas);
    } catch (error) {
        console.error("Error al obtener tareas asignadas: ", error);
        res.status(500).json({ message: error.message });
    }
};

export { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareaRealizadaPorId,obtenerTareasAsignadas,obtenerTareasCompletas,obtenerTareasIncompletas,obtenerTareasNoRealizadas };
