const { Post, User, Tag, Post_Images, Comment } = require("../../models");

const verificarSiElPostExiste = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nickName"],
        },
        {
          model: Tag,
          as: "tags",
        },
        {
          model: Post_Images,
          as: "images",
        },
        {
          model: Comment,
          as: "comments",
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        message: "Publicación no encontrada",
      });
    }

    req.post = post;
    return next();
  } catch (error) {
    console.error("Error al verificar la publicación:", error);

    return res.status(500).json({
      message: "Error al verificar la publicación",
    });
  }
};

module.exports = verificarSiElPostExiste;
