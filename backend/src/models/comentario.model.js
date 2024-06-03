import { Schema, model } from "mongoose";
import User from "./user.model.js"; // Asegúrate de importar el modelo User correctamente
import tarea from "./tarea.model.js"; // Asegúrate de importar el modelo tarea correctamente

const comentarioSchema = new Schema(
  {
    RutAsignado: {
      type: String,
      ref: 'User',
      required: [true, 'Por favor, ingrese el rut del usuario'],
      validate: {
        validator: async function(rutUsuario) {
          const user = await User.findOne({ rut: rutUsuario });
          return !!user;
        },
        message: 'El rut del usuario ingresado no existe'
      }
    },
    tarea: {
      type: Schema.Types.ObjectId,
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
  { collection: "comentarios", versionKey: false, timestamps: true }
);

comentarioSchema.index({ RutAsignado: 1, tarea: 1 }, { unique: true });

export default model("Comentario", comentarioSchema);
