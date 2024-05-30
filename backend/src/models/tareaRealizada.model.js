import { Schema, model } from 'mongoose';


const tareaRealizadaSchema = new Schema({
    tarea: {
        type: Schema.Types.ObjectId,
        ref: 'Tarea',
        required: true,
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
        default: 'inncompleta', 
    },
    tiempoRespuesta: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true 
});

export default model('TareaRealizada', tareaRealizadaSchema);