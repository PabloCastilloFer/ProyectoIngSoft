"use strict";

import { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    // Falta conectar con el esquema 'Tarea'
    id: {
      type: String,
      required: true,
    },
    asignadoA: {
      type: String,
      required: true,
    },
    asignadoHistorial: {
      type: [String],
      default: function() {
        return [this.asignadoA];
      },
    },
  },
  {
    versionKey: false,
  },
);

ticketSchema.methods.agregarAsignacion = function(asignadoA) {
  this.asignadoHistorial.push(asignadoA);
};

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
