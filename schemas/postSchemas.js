const Joi = require("joi");

const postSchema = Joi.object({
  description: Joi.string().trim().min(1).max(300).required().messages({
    "string.empty": "La descripción no puede estar vacia",
    "string.min": "La descripción es obligatoria",
    "string.max": "La descripción no puede superar los 300 caracteres",
    "any.required": "La descripción es obligatoria",
  }),
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del usuario debe ser numerico",
    "number.integer": "El ID del usuario debe ser un entero",
    "number.positive": "El ID del usuario debe ser positivo",
    "any.required": "El ID del usuario es obligatorio",
  }),
});

const postActualizarSchema = Joi.object({
  description: Joi.string().trim().min(1).max(300).optional().messages({
    "string.empty": "La descripción no puede estar vacía",
    "string.min": "La descripción es obligatoria",
    "string.max": "La descripción no puede superar los 300 caracteres",
  }),
}).min(1);
module.exports = {
  postSchema,
  postActualizarSchema,
};
