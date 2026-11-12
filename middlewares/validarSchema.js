const validarSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Los datos enviados son inválidos",
      errores: error.details.map((detalle) => detalle.message),
    });
  }

  req.body = value;
  return next();
};

module.exports = validarSchema;
