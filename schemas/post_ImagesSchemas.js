const Joi = require("joi");

const post_ImageSchema = Joi.object({
  url: Joi.string().uri().max(200).required().messages({
    "string.empty": "La URL de la imagen no puede estar vacia",
    "string.uri": "La URL de la imagen no tiene un formato valido",
    "string.max": "La URL de la imagen no puede superar los 200 caracteres",
    "any.required": "La URL de la imagen es obligatoria",
  }),
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "El ID de la publicacion debe ser numerico",
    "number.integer": "El ID de la publicación debe ser un número entero",
    "number.positive": "El ID de la publicacion debe ser positivo",
    "any.required": "El ID de la publicacion es obligatorio",
  }),
});

const post_ImageAnidadaSchema = Joi.object({
  url: Joi.string().uri().max(200).required().messages({
    "string.empty": "La URL de la imagen no puede estar vacía",
    "string.uri": "La URL de la imagen no tiene un formato válido",
    "string.max": "La URL de la imagen no puede superar los 200 caracteres",
    "any.required": "La URL de la imagen es obligatoria",
  }),
});

// Schema para actualizar una imagen
const post_ImageUpdateSchema = Joi.object({
  url: Joi.string().uri().max(200).optional().messages({
    "string.empty": "La URL de la imagen no puede estar vacía",
    "string.uri": "La URL de la imagen no tiene un formato válido",
    "string.max": "La URL de la imagen no puede superar los 200 caracteres",
  }),
  postId: Joi.number().integer().positive().optional().messages({
    "number.base": "El ID de la publicacion debe ser numerico",
    "number.integer": "El ID de la publicación debe ser un número entero",
    "number.positive": "El ID de la publicacion debe ser positivo",
  }),
}).min(1);

module.exports = {
  post_ImageSchema,
  post_ImageAnidadaSchema,
  post_ImageUpdateSchema,
};
