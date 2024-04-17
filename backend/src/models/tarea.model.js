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

    tipoTarea: {
        type: String,
        required: true,
        enum: ['simple','extensa'],
        set: (value) => value.toLowerCase(),
        validate: {
            validator: function (value) {
                if (value === 'simple'){
                    return value.length === 6;
                } else if (value === 'extensa'){
                    return value.length === 7;
                }
                return false;
            },
            message: 'La longitud del parametro tipoTarea no es válida.'
        }
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
