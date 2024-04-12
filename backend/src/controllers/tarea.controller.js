import tarea from '../models/tarea.model.js';

export const crearTarea = async (req, res) => {
    const { nombreTarea, descripcionTarea, FechaCreacion } = req.body;

try {
    const nuevaTarea = new tarea({
        nombreTarea,
        descripcionTarea,
        fechaCreacion: FechaCreacion // Aquí usamos FechaCreacion
    });
    const tareaGuardada = await nuevaTarea.save();  
    res.status(201).json(tareaGuardada);
} catch (error) {
    res.status(400).json({ message: error.message });
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

