/*"use strict ";

import mongoose from "mongoose";

const generarPDFSchema = new mongoose.Schema({
    empleadoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Empleado",
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now(),
    },
    horasTrabajadas: {
        type: Number,
        required: true,
    },
    });

    export default mongoose.model("generarPDF", generarPDFSchema);
    */