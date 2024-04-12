import Comentario from "../models/comentario.model.js";

export const ComentarioController = {
    async crearComentario(req, res) {
      try {
        const { supervisor, rutEmpleado, comentario } = req.body; // Obtener supervisor y rutEmpleado del cuerpo de la solicitud
        
        // Crear un nuevo comentario
        const nuevoComentario = new Comentario({
          supervisor,
          rutEmpleado,
          comentario,
        });
  
        // Guardar el comentario en la base de datos
        await nuevoComentario.save();
  
        res.status(201).json(nuevoComentario);
      } catch (error) {
        console.error("Error al dejar un comentario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    },

  async listarComentarios(req, res) {
    try {
      // Obtener todos los comentarios de la base de datos
      const comentarios = await Comentario.find();

      res.status(200).json(comentarios);
    } catch (error) {
      console.error("Error al listar comentarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async modificarComentario(req, res) {
    try {
      const { id } = req.params;
      const { comentario } = req.body;
      
      // Buscar el comentario por su ID y actualizarlo
      const comentarioModificado = await Comentario.findByIdAndUpdate(id, { comentario }, { new: true });

      if (!comentarioModificado) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }

      res.status(200).json(comentarioModificado);
    } catch (error) {
      console.error("Error al modificar comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  async eliminarComentario(req, res) {
    try {
      const { id } = req.params;
      
      // Buscar el comentario por su ID y eliminarlo
      const comentarioEliminado = await Comentario.findByIdAndDelete(id);

      if (!comentarioEliminado) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }

      res.status(200).json({ mensaje: "Comentario eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};

