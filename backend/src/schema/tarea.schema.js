"use strict";
import Joi from "joi";

/**
 * Esquema de validación para la creación de una tarea
 * @constant {Object}
 */
export const crearTareaSchema = Joi.object({
    nombreTarea: Joi.string().label('nombreTarea').required().regex(/^[A-Za-zÁ-Úá-ú\s]+$/u).messages ({
        "string.empty":"El nombre de la tarea no puede estar vacío.",
        "any.required":"El nombre de la tarea es obligatorio.",
        "string.base":"El nombre de la tarea debe ser de tipo string.",
        "string.pattern.base": "El nombre solo puede contener letras y espacios."
    }),
    descripcionTarea: Joi.string().label('descripcionTarea').required().custom((value, helpers) => {
        const wordCount = value.trim().split(/\s+/).length;
        if (wordCount <= 500) {
          return value;
        } else {
          return helpers.message("La descripción no puede exceder las 500 palabras.");
        }
      }).messages({
        "string.empty": "La descripción no puede estar vacía.",
        "string.base": "La descripción debe ser de tipo string.",
        "any.required": "La descripción es obligatoria.",
      }),
      tipoTarea: Joi.string().label('tipoTarea').required().valid('simple','extensa').messages({
        "string.empty": "El tipo de tarea no puede estar vacío.",
        "any.required": "El tipo de tarea es obligatorio.",
        "string.base": "El tipo de tarea debe ser de tipo string.",
        "any.only": "El tipo de tarea debe ser simple o extensa."
      }),
})