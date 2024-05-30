"use strict";

import { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    tareaId: {
      type: String,
      ref: 'Tarea',
      required: true,
    },

    asignadoA: {
      type: String,
      ref: 'User',
      required: true,
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
