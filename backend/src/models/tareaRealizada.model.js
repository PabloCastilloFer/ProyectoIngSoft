import { Schema, model } from 'mongoose';

const tareaRealizadaSchema = new Schema({
    tarea: {
        type: String,
        ref: 'Tarea',
        required: true
    },
    ticket: {
        type: String,
        ref: 'Ticket',
        required: true
    },
    comentario: {
        type: String,
        required: false
    },
    archivoAdjunto: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: true,
        enum: ['completa','incompleta','no realizada'],
       
    }
}, {
    timestamps: true
});

export default model('TareaRealizada', tareaRealizadaSchema);
