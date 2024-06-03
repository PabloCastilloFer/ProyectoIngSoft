import { Schema, model } from "mongoose";
const comentarioSchema = new Schema(
  {
    supervisor: {
      type: String,
      required: true,
    },
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
