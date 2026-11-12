const validarTagId = (req, res, next) => {
  const tagId = Number(req.params.tagId);

  if (!Number.isInteger(tagId) || tagId <= 0) {
    return res.status(400).json({
      message: "El ID de la etiqueta debe ser un entero positivo",
    });
  }

  next();
};

module.exports = validarTagId;
