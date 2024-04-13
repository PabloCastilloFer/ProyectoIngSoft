import tarea from '../models/tarea.model.js';
import { crearTareaSchema } from '../schema/tarea.schema.js';

export const crearTarea = async (req, res) => {
    const { nombreTarea, descripcionTarea, tipoTarea } = req.body;

try {
    const nuevaTarea = new tarea({
        nombreTarea,
        descripcionTarea,
        tipoTarea
    });

    const {error} = crearTareaSchema.validate(req.body);
    if (error){
        res.status(400).json({ error: error.message });
        return;
    }

    const tareaGuardada = await nuevaTarea.save();  
    res.status(201).json(tareaGuardada);
} catch (error) {
    res.status(500).json({ message: error.message });
}
}

export const getTareas = async (req, res) => {
    try {
        const tareas = await tarea.find();
        res.status(200).json(tareas);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteTarea = async (req, res) => {
    const { nombreTarea } = req.params;
    try {
        await tarea.findOneAndDelete(nombreTarea);
        res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

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
        res.json(tareaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
