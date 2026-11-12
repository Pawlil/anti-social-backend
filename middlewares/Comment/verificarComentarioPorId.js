const { Comment } = require("../../models");

const verificarComentarioPorId = async (req, res, next) => {
  try {
    const comentario = await Comment.findByPk(req.params.id);

    if (!comentario) {
      return res.status(404).json({
        message: "Comentario no encontrado",
      });
    }

    req.comentario = comentario;

    return next();
  } catch (error) {
    console.error("Error al verificar el comentario:", error);

    return res.status(500).json({
      message: "Error al verificar el comentario",
    });
  }
};

module.exports = verificarComentarioPorId;
