"use strict";

import { Schema, model } from "mongoose";

const ticketSchema = new Schema(
  {
    tareaId: {
      type: Schema.Types.ObjectId,
      ref: 'Tarea',
      required: true,
    },    

    asignadoA: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    horaInicio: {
      type: String,
      validate: {
        validator: function(v) {
          // Verificar si la hora está en el formato correcto (HH:MM:SS)
          return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} no es una hora válida. Debe estar en el formato HH:MM:SS.`,
      },
      required: [true, 'La hora de inicio es requerida']
    },

    horaFin: {
      type: String,
      validate: {
        validator: function(v) {
          // Verificar si la hora está en el formato correcto (HH:MM:SS)
          return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(v);
        },
        message: props => `${props.value} no es una hora válida. Debe estar en el formato HH:MM:SS.`,
      },
      required: [true, 'La hora de fin es requerida']
    },

    asignadoHistorial: {
      type: [{ asignadoA: String, horaAsignacion: String }],
      default: function() {
        const horaAsignacion = new Date().toISOString().substring(11, 19);
        return [{ asignadoA: this.asignadoA, horaAsignacion }];
      },
    },
    
  },
  {
    versionKey: false,
  },
);

ticketSchema.pre('validate', function(next) {
  if (this.horaInicio && this.horaFin) {
    const inicio = new Date(`1970-01-01T${this.horaInicio}Z`);
    const fin = new Date(`1970-01-01T${this.horaFin}Z`);

    if (inicio >= fin) {
      this.invalidate('horaFin', 'La hora de fin debe ser después de la hora de inicio.');
    }
  }

  next();
});

ticketSchema.methods.agregarAsignacion = function(asignadoA) {
  this.asignadoHistorial.push({ asignadoA, hora: new Date() });
};

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
