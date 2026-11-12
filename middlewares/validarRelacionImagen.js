const { Post } = require("../models");

const validarRelacionImagen = async (req, res, next) => {
  try {
    if (req.body.postId === undefined) {
      return next();
    }

    const post = await Post.findByPk(req.body.postId);

    if (!post) {
      return res.status(404).json({
        message: "La publicación asociada a la imagen no existe",
      });
    }

    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al validar la publicación de la imagen" });
  }
};

module.exports = validarRelacionImagen;
