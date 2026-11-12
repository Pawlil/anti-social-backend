const { postSchema } = require("../../schemas/postSchemas");

const validarPost = (req, res, next) => {
  const { error, value } = postSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Datos de la publicación inválidos",
      error: error.details[0].message,
    });
  }

  req.body = value;
  next();
};

module.exports = validarPost;
