import { Schema, model } from "mongoose";
import Tarea from "./tarea.model"; 

const comentarioSchema = new Schema(
  {
    supervisor: {
        type: String,
        required: true,
    },
    rutEmpleado: {
      type: String,
      required: true,
    },
    tarea:{
      type: String,
      ref: "Tarea",
      required: true,
    },
    comentario: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "comentarios", versionKey: false, timestamps: true },
);

export default model("Comentario", comentarioSchema);
