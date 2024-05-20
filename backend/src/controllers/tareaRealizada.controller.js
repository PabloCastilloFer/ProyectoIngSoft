import TareaRealizada from '../models/TareaRealizada';

// Crear una nueva tarea realizada
async function crearTareaRealizada(req, res) {
    try {
        const { tarea, respuesta, archivoAdjunto, comentario } = req.body;
        const nuevaTareaRealizada = new TareaRealizada({
            tarea,
            respuesta,
            archivoAdjunto,
            comentario
        });
        const tareaRealizada = await nuevaTareaRealizada.save();
        res.status(201).json(tareaRealizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener todas las tareas realizadas
async function obtenerTareasRealizadas(req, res) {
    try {
        const tareasRealizadas = await TareaRealizada.find();
        res.status(200).json(tareasRealizadas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener una tarea realizada por su ID
async function obtenerTareaRealizadaPorId(req, res) {
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
}

// Actualizar una tarea realizada
async function actualizarTareaRealizada(req, res) {
  const tareaRealizadaId = req.params.id;
  const { respuesta, archivoAdjunto, comentario, estado } = req.body;
  try {
      let tareaRealizada = await TareaRealizada.findById(tareaRealizadaId);
      if (!tareaRealizada) {
          return res.status(404).json({ message: 'Tarea realizada no encontrada' });
      }

      // Obtener la tarea asociada
      let tarea = await Tarea.findById(tareaRealizada.tarea);
      if (!tarea) {
          return res.status(404).json({ message: 'Tarea asociada no encontrada' });
      }

      // Validación del tiempo
      if (tarea.plazo < Date.now()) {
          return res.status(400).json({ message: 'El plazo para realizar la tarea ha expirado' });
      }

      // Validación del estado
      if (estado && tarea.estado === 'completada') {
          return res.status(400).json({ message: 'No se puede actualizar una tarea realizada asociada a una tarea completada' });
      }

      tareaRealizada.respuesta = respuesta || tareaRealizada.respuesta;
      tareaRealizada.archivoAdjunto = archivoAdjunto || tareaRealizada.archivoAdjunto;
      tareaRealizada.comentario = comentario || tareaRealizada.comentario;
      tareaRealizada.estado = estado || tareaRealizada.estado;

      // Actualizar el estado de la tarea asociada si es necesario
      if (estado && tarea.estado !== estado) {
          tarea.estado = estado;
          await tarea.save();
      }

      const tareaActualizada = await tareaRealizada.save();
      res.status(200).json(tareaActualizada);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


// Eliminar una tarea realizada
async function eliminarTareaRealizada(req, res) {
    const tareaRealizadaId = req.params.id;
    try {
        const tareaRealizada = await TareaRealizada.findByIdAndDelete(tareaRealizadaId);
        if (!tareaRealizada) {
            return res.status(404).json({ message: 'Tarea realizada no encontrada' });
        }
        res.status(200).json({ message: 'Tarea realizada eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { crearTareaRealizada, obtenerTareasRealizadas, obtenerTareaRealizadaPorId, actualizarTareaRealizada, eliminarTareaRealizada };