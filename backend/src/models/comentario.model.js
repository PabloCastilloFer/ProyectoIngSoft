import { Schema, model } from "mongoose";
const comentarioSchema = new Schema(
  {
    supervisor: {
      type: String,
      ref: 'user',
      required: true,
    },
    rutEmpleado: {
      type: String,
      ref: 'user',
      required: true,
    },
    tarea:{
      type: String,
      ref: "tarea",
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
  { collection: "comentarios", versionKey: false, timestamps: true});

export default model("Comentario", comentarioSchema);
