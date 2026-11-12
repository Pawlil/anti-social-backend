const { User } = require("../../models");

const verificarNickUnico = async (req, res, next) => {
  try {
    const { nickName } = req.body;

    const usuarioExistente = await User.findOne({
      where: { nickName },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        message: "El nick ya está registrado",
      });
    }

    return next();
  } catch (error) {
    console.error("Error al verificar el nick:", error);
    return res.status(500).json({
      message: "Error al verificar la disponibilidad del nick",
    });
  }
};

module.exports = verificarNickUnico;
