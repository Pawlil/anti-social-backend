const { Post, Comment } = require("../../models");

const verificarRelacionesUsuario = async (req, res, next) => {
  try {
    const userId = req.usuario.id;

    const publicaciones = await Post.count({
      where: { userId },
    });

    const comentarios = await Comment.count({
      where: { userId },
    });

    if (publicaciones > 0 || comentarios > 0) {
      return res.status(409).json({
        message:
          "No se puede eliminar el usuario porque tiene publicaciones o comentarios asociados",
        publicaciones,
        comentarios,
      });
    }

    return next();
  } catch (error) {
    console.error("Error al verificar las relaciones:", error);

    return res.status(500).json({
      message: "Error al verificar las relaciones del usuario",
    });
  }
};

module.exports = verificarRelacionesUsuario;
