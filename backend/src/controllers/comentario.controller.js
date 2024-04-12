import Comentario from "../models/comentario.model.js";

export const ComentarioController = {
  async createComentario(req, res) {
    try {
      const { empleadoId, supervisorId, comentario } = req.body;
      
      // Crear un nuevo comentario
      const newComentario = new Comentario({
        empleadoId,
        supervisorId,
        comentario,
      });

      // Guardar el comentario en la base de datos
      await newComentario.save();

      res.status(201).json(newComentario);
    } catch (error) {
      console.error("Error al dejar un comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
