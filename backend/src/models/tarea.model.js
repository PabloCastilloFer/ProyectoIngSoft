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

    estado: {
        type: String,
        required: true,
        enum: ['nueva','asignada','entregada','verificada'],
        set: (value) => value.toLowerCase(),
        validate: {
            validator: function (value) {
                if (value === 'nueva'){
                    return value.length === 5;
                } else if (value === 'asignada'){
                    return value.length === 8;
                } else if (value === 'entregada'){
                    return value.length === 9;
                } else if (value === 'verificada'){
                    return value.length === 10;
                }
                return false;
            },
            message: 'La longitud del parametro estado no es válida.'
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
