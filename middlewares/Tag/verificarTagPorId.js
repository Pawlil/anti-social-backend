const { Tag } = require("../../models");

const verificarTagPorId = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Etiqueta no encontrada",
      });
    }

    req.tag = tag;
    return next();
  } catch (error) {
    console.error("Error al buscar la etiqueta:", error);

    return res.status(500).json({
      message: "Error al consultar la etiqueta",
    });
  }
};

module.exports = verificarTagPorId;
