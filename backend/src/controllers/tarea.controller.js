import tarea from '../models/tarea.model.js';
import { HOST, PORT } from '../config/configEnv.js';
import { crearTareaSchema } from '../schema/tarea.schema.js';
import { v4 as uuidv4 } from 'uuid'; // Importar la función uuidv4

export const createTarea = async (req, res) => {
    try {
        const archivo = req.file.filename;
        const URL = `http://${HOST}:${PORT}/api/tarea/src/upload/`;

        // Generar una ID aleatoria utilizando uuidv4
        const idTarea = uuidv4();

        const nuevaTarea = {
            nombreTarea: req.body.nombreTarea,
            descripcionTarea: req.body.descripcionTarea,
            tipoTarea: req.body.tipoTarea,
            estado: 'nueva',
            idTarea: idTarea, // Usar la ID generada
            archivo: URL + archivo
        };
        const { error } = crearTareaSchema.validate(nuevaTarea);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

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

export const updateNewTarea = async (req, res) => {
    try {
        const { nombreTarea } = req.params;
        const tareaOriginal = await tarea.findOne({ nombreTarea });

        if (!tareaOriginal) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        const archivo = req.file ? req.file.filename : tareaOriginal.archivo.split('/').pop();
        const URL = `http://${HOST}:${PORT}/api/tarea/src/upload/`;
        const idTarea = uuidv4();

        const nuevaTarea = {
            nombreTarea: req.body.nombreTarea || tareaOriginal.nombreTarea,
            descripcionTarea: req.body.descripcionTarea || tareaOriginal.descripcionTarea,
            tipoTarea: req.body.tipoTarea || tareaOriginal.tipoTarea,
            estado: req.body.estado || tareaOriginal.estado,
            idTarea: idTarea,
            archivo: req.file ? URL + archivo : tareaOriginal.archivo
        };

        const { error } = crearTareaSchema.validate(nuevaTarea);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const newTarea = new tarea(nuevaTarea);
        const tareaGuardada = await newTarea.save();
        
        res.status(201).json({
            message: "Nueva tarea creada con las modificaciones!",
            tarea: tareaGuardada
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};