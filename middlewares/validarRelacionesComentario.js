const { User, Post } = require("../models");

const validarRelacionesComentario = async (req, res, next) => {
  try {
    const usuario = await User.findByPk(req.body.userId);
    if (!usuario) {
      return res.status(404).json({ message: "El usuario del comentario no existe" });
    }

    const post = await Post.findByPk(req.body.postId);
    if (!post) {
      return res.status(404).json({ message: "La publicación del comentario no existe" });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ message: "Error al validar las relaciones del comentario" });
  }
};

module.exports = validarRelacionesComentario;
