// modioficar idea copilot
const Asignacion = require('../models/asignacion.model');
const Tarea = require('../models/tarea.model');
const Empleado = require('../models/empleado.model');

exports.asignarTarea = async (req, res) => {
    const { idTarea, idEmpleado } = req.body;

    try {
        const tarea = await Tarea.findById(idTarea);
        const empleado = await Empleado.findById(idEmpleado);

        if (!tarea || !empleado) {
            return res.status(404).send({ message: 'Tarea o Empleado no encontrado' });
        }

        if (tarea.estado !== 'no asignada' && tarea.tiempoAsignacion > 10) {
            return res.status(400).send({ message: 'La tarea ya está asignada y ha pasado el tiempo límite para reasignar' });
        }

        if (!empleado.tieneHorarioDisponible()) {
            return res.status(400).send({ message: 'El empleado no tiene horario disponible' });
        }

        const asignacion = new Asignacion({ tarea: idTarea, empleado: idEmpleado });
        await asignacion.save();

        tarea.estado = 'asignada';
        await tarea.save();

        // Aquí deberías implementar el envío de la notificación al empleado

        res.status(200).send({ message: 'Tarea asignada con éxito' });
    } catch (error) {
        res.status(500).send({ message: 'Error al asignar la tarea' });
    }
};

exports.desasignarTarea = async (req, res) => {
    const { idTarea, idEmpleado } = req.body;

    try {
        const tarea = await Tarea.findById(idTarea);
        const empleado = await Empleado.findById(idEmpleado);

        if (!tarea || !empleado) {
            return res.status(404).send({ message: 'Tarea o Empleado no encontrado' });
        }

        if (tarea.estado !== 'asignada' || tarea.tiempoAsignacion > 10) {
            return res.status(400).send({ message: 'La tarea no puede ser desasignada' });
        }

        await Asignacion.deleteOne({ tarea: idTarea, empleado: idEmpleado });

        tarea.estado = 'no asignada';
        await tarea.save();

        // Aquí deberías implementar el envío de la notificación al empleado

        res.status(200).send({ message: 'Tarea desasignada con éxito' });
    } catch (error) {
        res.status(500).send({ message: 'Error al desasignar la tarea' });
    }
};