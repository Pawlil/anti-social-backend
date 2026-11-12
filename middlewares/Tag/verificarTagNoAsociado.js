const verificarTagNoAsociado = async (req, res, next) => {
  try {
    const tags = await req.post.getTags();

    const yaExiste = tags.some((tag) => tag.id === req.tag.id);

    if (yaExiste) {
      return res.status(409).json({
        message: "La etiqueta ya está asociada a este post",
      });
    }

    return next();
  } catch (error) {
    console.error("Error al verificar la asociación:", error);

    return res.status(500).json({
      message: "Error al verificar la etiqueta del post",
    });
  }
};

module.exports = verificarTagNoAsociado;
