"use strict";

import { Schema, model } from "mongoose";

import User from "./user.model.js"; // Asegúrate de que la ruta sea correcta
import Tarea from "./tarea.model.js"; // Asegúrate de que la ruta sea correcta


const ticketSchema = new Schema(
  {
    TareaID: {
      type: String,
      required: [true, 'Por favor, ingrese una ID de tarea'],
      validate: {
        validator: async function(TareaID) {
          const tarea = await Tarea.findOne({ idTarea: TareaID });
          return !!tarea;
        },
        message: 'La ID de la tarea ingresada no existe'
      }
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

    Inicio: {
      type: Date,
      required: [true, 'La fecha y hora de inicio son requeridas']
    },

    Fin: {
      type: Date,
      required: [true, 'La fecha y hora de fin son requeridas']
    },

    asignadoHistorial: {
      type: [{ asignadoA: String, horaAsignacion: Date }],
      default: function() {
        const horaAsignacion = new Date();
        return [{ asignadoA: this.asignadoA, horaAsignacion }];
      },
    },

  },
  {
    versionKey: false,
  },
);

ticketSchema.methods.agregarAsignacion = function(asignadoA) {
  const horaAsignacion = new Date();
  this.asignadoHistorial.push({ asignadoA, horaAsignacion});
};

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
