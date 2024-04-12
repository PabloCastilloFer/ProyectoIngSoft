import {Schema , model} from 'mongoose';

const tareaSchema = new Schema({

    nombreTarea: {
        type: String,
        required: true,
    },

    descripcionTarea: {
        type: String,
        required: true,
    },

    fechaCreacion: {
        type: String,
        required: true,
    },

},
{
    timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => new Date(Date.now() - 14400000)
  }
});

export default model('tarea', tareaSchema);
