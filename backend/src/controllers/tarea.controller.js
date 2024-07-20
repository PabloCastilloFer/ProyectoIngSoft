import tarea from '../models/tarea.model.js';
import { HOST, PORT } from '../config/configEnv.js';
import { crearTareaSchema } from '../schema/tarea.schema.js';
import { v4 as uuidv4 } from 'uuid';

export const createTarea = async (req, res) => {
    try {
        let archivoURL = null;

        if (req.file) {
            const archivo = req.file.filename;
            archivoURL = `http://${HOST}:${PORT}/api/tarea/src/upload/` + archivo;
        }

        const idTarea = uuidv4();

        const nuevaTarea = {
            nombreTarea: req.body.nombreTarea,
            descripcionTarea: req.body.descripcionTarea,
            tipoTarea: req.body.tipoTarea,
            estado: 'nueva',
            idTarea: idTarea,
            archivo: archivoURL
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


export const deleteTareaById = async (req, res) => {
    try {
        const { idTarea } = req.params;
        await tarea.findOneAndDelete({ idTarea });
        res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateTarea = async (req, res) => {
    try {
        const idTarea = uuidv4();
        const tareaActual = req.params.idTarea;
        const tareaModificada = await tarea.findOne({ idTarea: tareaActual });

        if (!tareaModificada) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        const archivo = req.file ? req.file.filename : tareaModificada.archivo.split('/').pop();
        const URL = `http://${HOST}:${PORT}/api/tarea/src/upload/`;

        const updatedTarea = {
            nombreTarea: req.body.nombreTarea || tareaModificada.nombreTarea,
            descripcionTarea: req.body.descripcionTarea || tareaModificada.descripcionTarea,
            tipoTarea: req.body.tipoTarea || tareaModificada.tipoTarea,
            estado: 'nueva',
            archivo: req.file ? URL + archivo : tareaModificada.archivo,
            idTarea: req.body.idTarea || idTarea
        };

        const { error } = crearTareaSchema.validate(updatedTarea);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        tareaModificada.nombreTarea = updatedTarea.nombreTarea;
        tareaModificada.descripcionTarea = updatedTarea.descripcionTarea;
        tareaModificada.tipoTarea = updatedTarea.tipoTarea;
        tareaModificada.estado = updatedTarea.estado;
        tareaModificada.archivo = updatedTarea.archivo;
        tareaModificada.idTarea = updatedTarea.idTarea;

        const tareaActualizada = await tareaModificada.save();
        res.status(200).json({
            message: "Tarea actualizada exitosamente!",
            tarea: tareaActualizada
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNewTarea = async (req, res) => {
    try {
        const { idTarea } = req.params;
        const tareaOriginal = await tarea.findOne({ idTarea });

        if (!tareaOriginal) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        const archivo = req.file ? req.file.filename : tareaOriginal.archivo.split('/').pop();
        const URL = `http://${HOST}:${PORT}/api/tarea/src/upload/`;
        const idTareaa = uuidv4();

        const nuevaTarea = {
            nombreTarea: req.body.nombreTarea || tareaOriginal.nombreTarea,
            descripcionTarea: req.body.descripcionTarea || tareaOriginal.descripcionTarea,
            tipoTarea: req.body.tipoTarea || tareaOriginal.tipoTarea,
            estado: req.body.estado || tareaOriginal.estado,
            idTarea: idTareaa,
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

export const getArchives = async (req, res) => {
    try {
        const { error, value } = fileParamsSchema.validate({ filename: req.params.filename });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const filename = value.filename;
        const file = path.join(__dirname, '..', 'src', 'upload', filename);

        if (!fs.existsSync(file)) {
            return res.status(404).json({ message: 'Archivo no encontrado' });
        }

        res.download(file, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                res.status(500).send('Error interno al descargar el archivo');
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};