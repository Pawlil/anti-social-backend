const { User } = require("../../models");

const validarUsuarioSeguido = async (req, res, next) => {
  try {
    const { followerId, followedId } = req.params;

    const usuarioSeguidor = await User.findByPk(Number(followerId));
    const usuarioSeguido = await User.findByPk(Number(followedId));

    if (!usuarioSeguidor || !usuarioSeguido) {
      return res.status(404).json({
        message: "Uno o ambos usuarios no existen",
      });
    }

    req.usuarioSeguidor = usuarioSeguidor;
    req.usuarioSeguido = usuarioSeguido;

    return next();
  } catch (error) {
    console.error("Error al verificar usuarios:", error);

    return res.status(500).json({
      message: "Error al verificar los usuarios",
    });
  }
};

module.exports = validarUsuarioSeguido;
