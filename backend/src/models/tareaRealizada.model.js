import { Schema, model } from 'mongoose';

const tareaRealizadaSchema = new Schema({
    tarea: {
        type: Schema.Types.ObjectId,
        ref: 'Tarea',
        required: true
    },
    ticket: {
        type: Schema.Types.ObjectId,
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
        enum: ['completa', 'incompleta', 'no realizada'],
        default: 'no realizada'
    }
}, {
    timestamps: true
});

export default model('TareaRealizada', tareaRealizadaSchema);
