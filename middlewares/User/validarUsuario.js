const { userSchema } = require("../../schemas/userSchemas");

const validarUsuario = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Los datos del usuario son invalidos ",
      error: error.details[0].message,
    });
  }
  req.body = value;
  next();
};

module.exports = validarUsuario;
