const Joi = require("joi");

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(200).required().messages({
    "string.empty": "El contenido del comentario no puede estar vacio",
    "string.min": "El comentario debe tener al menos 1 caracter",
    "string.max": "El comentario no puede superar los 200 caracter",
    "string.empty": "El contenido no puede estar vacío",
  }),
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la publicación debe ser numerrico",
    "number.integer": "El ID de la publicación debe ser un numero entero",
    "number.positive": "El ID de la publicación debe ser positivo",
    "any.required": "El ID de la publicación es obligatorio",
  }),
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del usuario debe ser numerico",
    "number.integer": "El ID del usuario debe ser un numero entero",
    "number.positive": "El ID del usuario debe ser positivo",
    "any.required": "El ID del usuario es obligatorio",
  }),
});

const commentContentSchema = Joi.object({
  content: Joi.string().min(1).max(200).required().messages({
    "string.empty": "El contenido no puede estar vacío",
    "string.min": "El comentario debe tener al menos 1 carácter",
    "string.max": "El comentario no puede superar los 200 caracteres",
    "any.required": "El contenido es obligatorio",
  }),
});

module.exports = {
  commentSchema,
  commentContentSchema,
};
