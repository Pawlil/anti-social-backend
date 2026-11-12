const verificarTagAsociado = async (req, res, next) => {
  try {
    const tags = await req.post.getTags();

    const estaAsociado = tags.some(
      (tag) => String(tag.id) === String(req.tag.id),
    );

    if (!estaAsociado) {
      return res.status(404).json({
        message: "La etiqueta no está asociada a este post",
      });
    }

    return next();
  } catch (error) {
    console.error("Error al verificar la asociación:", error);

    return res.status(500).json({
      message: "Error al verificar la asociación de la etiqueta",
    });
  }
};

module.exports = verificarTagAsociado;
