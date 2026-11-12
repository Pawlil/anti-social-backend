const { Post_Images } = require("../../models");

const validarImagenPorId = async (req, res, next) => {
  try {
    const imagen = await Post_Images.findByPk(req.params.id);

    if (!imagen) {
      return res.status(404).json({
        message: "Imagen no encontrada",
      });
    }

    req.imagen = imagen;
    return next();
  } catch (error) {
    console.error("Error al verificar la imagen:", error);
    return res.status(500).json({
      message: "Error al verificar la imagen",
    });
  }
};

module.exports = validarImagenPorId;
