import { Schema, model } from "mongoose";
import "./tarea.model.js";
import "./comentario.model.js"

const empleadoSchema = new Schema(
  {
    rutEmpleado:{
      type: String,
      required: true,
      unique: true,
    },
    tarea:{
      type: String,
      ref: "tarea",
      required: true,
    },
    datos: {
      type: String,
      ref: "comentario",
      required: true,
    },
  },
  { collection: "empleado", versionKey: false, timestamps: true },
);
export default model("Empleado", empleadoSchema);