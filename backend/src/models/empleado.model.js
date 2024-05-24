import { Schema, model } from "mongoose";
import Tarea from "./tarea.model.js";
import Comentario from "./comentario.model.js";

const empleadoSchema = new Schema(
  {
    rutEmpleado: {
      type: String,
      required: true,
      unique: true,
    },
    tarea: {
      type: Schema.Types.ObjectId,
      ref: "tarea",
      required: true,
    },
    datos: {
      type: Schema.Types.ObjectId,
      ref: "comentario",
      required: true,
    },
  },
  { collection: "empleado", versionKey: false, timestamps: true }
);

export default model("Empleado", empleadoSchema);
