const { User } = require("../../models");

const verificarSiElUsuarioExiste = async (req, res, next) => {
  try {
    const id = req.params.id ?? req.body.userId;
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ message: "El ID del usuario debe ser un entero positivo" });
    }

    const usuario = await User.findByPk(Number(id));
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.usuario = usuario;
    return next();
  } catch (error) {
    res.status(500).json({ message: "Error al verificar el usuario" });
  }
};

module.exports = verificarSiElUsuarioExiste;
