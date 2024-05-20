import Empleado from "../models/empleado.model.js";
import Tarea from "../models/tarea.model.js";
import Comentario from "../models/comentario.model.js";

export const EmpleadoController = {
  async crearEmpleado(req, res) {
    try {
      const { tarea, datos } = req.body; // Obtener datos de la solicitud

      // Crear un nuevo empleado
      const nuevoEmpleado = new Empleado({
        tarea,
        datos,
      });

      // Guardar el empleado en la base de datos
      await nuevoEmpleado.save();

      // Buscar la tarea y el comentario asociados al empleado
      const tareaAsociada = await Tarea.findById(tarea).select('nombreTarea descripcionTarea estado');
      const comentarioAsociado = await Comentario.findById(datos).select('supervisor rutEmpleado comentario');

      // Agregar la tarea y el comentario asociados al empleado
      nuevoEmpleado.tarea = tareaAsociada;
      nuevoEmpleado.datos = comentarioAsociado;

      res.status(201).json(nuevoEmpleado);
    } catch (error) {
      console.error("Error al crear un empleado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async listarEmpleados(req, res) {
    try {
      // Obtener todos los empleados de la base de datos y popular los campos tarea y datos
      const empleados = await Empleado.find().populate('tarea', 'nombreTarea descripcionTarea estado').populate('datos', 'supervisor rutEmpleado comentario');

      res.status(200).json(empleados);
    } catch (error) {
      console.error("Error al listar empleados:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async modificarEmpleado(req, res) {
    try {
      const { id } = req.params;
      const { tarea, datos } = req.body;

      // Buscar el empleado por ID y actualizarlo
      const empleadoModificado = await Empleado.findByIdAndUpdate(
        id,
        { tarea, datos },
        { new: true }
      ).populate('tarea', 'nombreTarea descripcionTarea estado').populate('datos', 'supervisor rutEmpleado comentario');

      if (!empleadoModificado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

      res.status(200).json(empleadoModificado);
    } catch (error) {
      console.error("Error al modificar empleado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async eliminarEmpleado(req, res) {
    try {
      const { id } = req.params;

      // Buscar el empleado por su ID y eliminarlo
      const empleadoEliminado = await Empleado.findByIdAndDelete(id);

      if (!empleadoEliminado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

      res.status(200).json({ mensaje: "Empleado eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
