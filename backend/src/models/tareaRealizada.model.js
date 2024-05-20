import { Schema, model } from 'mongoose';

const tareaRealizadaSchema = new Schema({
    tarea: {
        type: Schema.Types.ObjectId,
        ref: 'Tarea',
        required: true,
    },
    respuesta: {
        type: String,
    },
    archivoAdjunto: {
        type: String,
    },
    comentario: {
        type: String,
    },
    estado: {
        type: String,
        enum: ['completada', 'incompleta', 'no realizada'],
        default: 'completada', // Por defecto, una tarea realizada se considera completada
    },
    tiempoRespuesta: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true // Esto agregará automáticamente los campos createdAt y updatedAt
});

export default model('TareaRealizada', tareaRealizadaSchema);