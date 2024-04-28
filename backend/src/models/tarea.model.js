import { Schema, model } from 'mongoose';

const tareaSchema = new Schema({
    idTarea: {
        type: String,
        unique: true,
        required: true
    },
    nombreTarea: {
        type: String,
        required: true,
    },
    descripcionTarea: {
        type: String,
        required: true,
        unique: true,
    },
    tipoTarea: {
        type: String,
        required: true,
        enum: ['simple', 'extensa'],
        set: (value) => value.toLowerCase(),
        validate: {
            validator: function (value) {
                if (value === 'simple') {
                    return value.length === 6;
                } else if (value === 'extensa') {
                    return value.length === 7;
                }
                return false;
            },
            message: 'La longitud del parámetro tipoTarea no es válida.'
        }
    },
    estado: {
        type: String,
        required: true,
        enum: ['nueva', 'asignada', 'entregada', 'revisada', 'en revision'],
        set: (value) => value.toLowerCase(),
        validate: {
            validator: function (value) {
                if (value === 'nueva') {
                    return value.length === 5;
                } else if (value === 'asignada') {
                    return value.length === 8;
                } else if (value === 'entregada') {
                    return value.length === 9;
                } else if (value === 'revisada') {
                    return value.length === 8;
                } else if (value === 'en revision') {
                    return value.length === 11;
                }
                return false;
            },
            message: 'La longitud del parámetro estado no es válida.'
        }
    },
    archivo: {
        type: String,
        required: true,
    },
    
    idTarea: {
        type: String,
        required: true,
        unique: true
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            currentTime: () => new Date(Date.now() - 14400000)
        }
    });

// Función para generar un ID aleatorio único
const generateRandomID = () => {
    const idLength = 5; // Longitud deseada del ID
    const characters = '0123456789';
    let id = '';
    for (let i = 0; i < idLength; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
};

// Middleware para generar un ID único antes de guardar una tarea
tareaSchema.pre('save', function (next) {
    if (!this.idTarea) {
        this.idTarea = generateRandomID();
    }
    next();
});

export default model('tarea', tareaSchema);

