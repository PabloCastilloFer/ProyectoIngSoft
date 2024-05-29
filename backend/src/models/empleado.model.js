// empleado.model.js
"use strict";
import { Schema, model } from "mongoose";

const empleadoSchema = new Schema({
 
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true }  // Referencia a User
});

const Empleado = model("Empleado", empleadoSchema);

export default Empleado;
