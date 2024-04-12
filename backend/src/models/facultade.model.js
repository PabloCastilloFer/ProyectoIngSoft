"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
import { Schema, model } from "mongoose";
import FACULTADES from "../constants/facultades.constants.js";

// Crea el esquema de la coleccion 'roles'
const facultadeSchema = new Schema(
  {
    name: {
      type: String,
      enum: FACULTADES,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

// Crea el modelo de datos 'Role' a partir del esquema 'roleSchema'
const Facultade = model("Facultade", facultadeSchema);

export default Facultade;
