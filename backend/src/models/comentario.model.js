import { Schema, model } from "mongoose";
import User from "./user.model.js"; // AsegÃºrate de importar el modelo User correctamente

const comentarioSchema = new Schema(
  {
    ticket: {
      type: String,
      ref: 'User',
      required: [true, 'Por favor, ingrese el rut del usuario'],
      validate: {
        validator: async function(rutUsuario) {
          const user = await User.findOne({ rut: rutUsuario });
          console.log("Rut usuario: ", user)
          return !!user;
        },
        message: 'El rut del usuario ingresado no existe'
      }
    },
    tarea: {
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
  { collection: "comentarios", versionKey: false, timestamps: true }
);

export default model("Comentario", comentarioSchema);