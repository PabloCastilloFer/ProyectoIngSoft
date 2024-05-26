import Joi from "joi";

/**
 * Esquema de validación para la creación de una tarea realizada
 * @constant {Object}
 */
export const crearTareaRealizadaSchema = Joi.object({
    tarea: Joi.string().label('tarea').required().messages({
        "string.empty": "La tarea no puede estar vacía.",
        "any.required": "La tarea es obligatoria.",
        "string.base": "La tarea debe ser de tipo string."
    }),
    respuesta: Joi.string().label('respuesta').required().messages({
        "string.empty": "La respuesta no puede estar vacía.",
        "any.required": "La respuesta es obligatoria.",
        "string.base": "La respuesta debe ser de tipo string."
    }),
    archivoAdjunto: Joi.any().label('archivoAdjunto').optional(), // El archivo adjunto es opcional, Multer se encargará de validar esto
    comentario: Joi.string().label('comentario').optional().messages({
        "string.base": "El comentario debe ser de tipo string."
    }),
    estado: Joi.string().label('estado').required().valid('completada', 'incompleta', 'no realizada').messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es obligatorio.",
        "string.base": "El estado debe ser de tipo string.",
        "any.only": "El estado debe ser 'completada', 'incompleta' o 'no realizada'."
    })
});