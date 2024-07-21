import Joi from "joi";

/**
 * Esquema de validación para la creación de una tarea realizada
 */
export const crearTareaRealizadaSchema = Joi.object({
    TareaID: Joi.string().required().messages({
        "string.empty": "El campo TareaID no puede estar vacío.",
        "any.required": "El campo TareaID es obligatorio.",
    }),
    comentario: Joi.string().optional().allow('').messages({
        "string.empty": "El comentario debe ser una cadena.",
    }),
    estado: Joi.string().valid('completa', 'incompleta', 'no realizada').required().messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es obligatorio.",
        "string.base": "El estado debe ser de tipo string.",
        "any.only": "El estado debe ser 'completa', 'incompleta' o 'no realizada'."
    }),
});
