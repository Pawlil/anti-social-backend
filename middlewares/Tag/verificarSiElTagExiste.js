const { Tag } = require("../../models");

const verificarSiElTagExiste = async (req, res, next) => {
  try {
    const tagId = req.params.tagId ?? req.body.tagId;
    const tag = await Tag.findByPk(tagId);

    if (!tag) {
      return res.status(404).json({
        message: "La etiqueta no existe",
      });
    }

    req.tag = tag;
    return next();
  } catch (error) {
    console.error("Error al verificar la etiqueta:", error);
    return res.status(500).json({
      message: "Error al verificar la etiqueta",
    });
  }
};

module.exports = verificarSiElTagExiste;
