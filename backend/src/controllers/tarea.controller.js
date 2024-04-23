import tarea from '../models/tarea.model.js';
import { HOST, PORT } from '../config/configEnv.js';
import { crearTareaSchema } from '../schema/tarea.schema.js';

export const createTarea = async (req, res) => {
    try {
        const archivo = req.file.filename;
        const URL = `http://${HOST}:${PORT}/api/tarea/src/upload/`;
        const nuevaTarea = {
            nombreTarea: req.body.nombreTarea,
            descripcionTarea: req.body.descripcionTarea,
            tipoTarea: req.body.tipoTarea,
            estado: req.body.estado,
            archivo: URL + archivo
        };
        const newTarea = new tarea(nuevaTarea);
        const tareaGuardada = await newTarea.save();  
        res.status(201).json({
            message: "Tarea creada exitosamente!",
            tarea: tareaGuardada
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTareas = async (req, res) => {
    try {
        const tareas = await tarea.find();
        res.status(200).json(tareas);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getTarea = async (req, res) => {
    const { nombreTarea } = req.params;
    try {
        const tareaEncontrada = await tarea.findOne({ nombreTarea });
        res.status(200).json(tareaEncontrada);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
};

export const deleteTarea = async (req, res) => {
    const { nombreTarea } = req.params;
    try {
        await tarea.findOneAndDelete(nombreTarea);
        res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateTarea = async (req, res) => {
    
    try {
        const tareaActual = req.params.nombreTarea;
        const tareaModificada = await tarea.findOne({ nombreTarea: tareaActual });

        const { error } = crearTareaSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        tareaModificada.nombreTarea = req.body.nombreTarea;
        tareaModificada.descripcionTarea = req.body.descripcionTarea;
        tareaModificada.tipoTarea = req.body.tipoTarea;

        const tareaActualizada = await tareaModificada.save();
        res.status(201).json(tareaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
