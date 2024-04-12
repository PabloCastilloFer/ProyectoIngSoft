import { Schema, model } from "mongoose";

const comentarioSchema = new Schema(
  {
    rut: {
      type: String,
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
