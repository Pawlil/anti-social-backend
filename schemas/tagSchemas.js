const Joi = require("joi");

const tagSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "El nombre de la etiqueta no puede estar vacio",
    "string.min": "El nombre de la etiqueta debe tener al menos 3 caracteres",
    "string.max":
      "El nombre de la etiqueta no puede superar los 100 caracteres",
    "any.required": "El nombre de la etiqueta es obligatorio",
  }),
});

const tagAssociationSchema = Joi.object({
  tagId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del tag debe ser numérico",
    "number.integer": "El ID del tag debe ser un número entero",
    "number.positive": "El ID del tag debe ser positivo",
    "any.required": "El ID del tag es obligatorio",
  }),
});

module.exports = {
  tagSchema,
  tagAssociationSchema,
};
