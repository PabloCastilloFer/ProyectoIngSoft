const TareaRealizada = require("../models/tareaRealizada.model.js");

// Define las funciones del controlador
exports.crearTareaRealizada = async (req, res) => {
  try {
    const { Comentario, Estado } = req.body;
    const nuevaTarea = new TareaRealizada({
      Comentario,
      Estado,
    });
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerTareasRealizadas = async (req, res) => {
  try {
    const tareas = await TareaRealizada.find();
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};