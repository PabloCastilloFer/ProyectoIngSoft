// empleado.model.js
"use strict";
import { Schema, model } from "mongoose";

const empleadoSchema = new Schema({
  nombre: { type: String, required: true },
  rut: { type: String, required: true },
  facultad: { type: Schema.Types.ObjectId, ref: 'Facultade', required: true },
  tareas: [{ type: Schema.Types.ObjectId, ref: 'Tarea', required: true }],
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true }  // Referencia a User
});

const Empleado = model("Empleado", empleadoSchema);

export default Empleado;
