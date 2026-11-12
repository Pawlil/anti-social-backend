const { User } = require("../../models");

const verificarNickNameUnico = async (req, res, next) => {
  try {
    const { nickName } = req.body;

    const usuarioExistente = await User.findOne({
      where: { nickName },
    });

    if (
      usuarioExistente &&
      Number(usuarioExistente.id) !== Number(req.usuario.id)
    ) {
      return res.status(409).json({
        message: "El nickName ya está registrado",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      message: "Error al verificar la unicidad del nickName",
    });
  }
};

module.exports = verificarNickNameUnico;
