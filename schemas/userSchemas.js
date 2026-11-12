const Joi = require("joi");

const userSchema = Joi.object({
  nickName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El apodo no puede estar vacío",
    "string.min": "El apodo debe tener al menos 3 caracteres",
    "string.max": "El apodo no puede superar los 100 caracteres",
    "any.required": "El apodo es obligatorio",
  }),
});

module.exports = {
  userSchema,
};
