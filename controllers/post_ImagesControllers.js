const { Post_Images } = require("../models");

const obtenerImagenes = async (req, res) => {
  try {
    const imagenes = await Post_Images.findAll();
    res.status(200).json(imagenes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las imagenes" });
  }
};

const obtenerImagen = async (req, res) => {
  try {
    return res.status(200).json(req.imagen);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al intentar obtener la imagen" });
  }
};

const crearImagen = async (req, res) => {
  try {
    const imagen = await Post_Images.create({
      ...req.body,
      postId: req.body.postId || req.params.id,
    });

    return res.status(201).json({
      message: "Imagen agregada con exito",
      imagen,
    });
  } catch (error) {
    console.error("Error al crear la imagen:", error);

    return res.status(500).json({
      message: "Error al intentar cargar la imagen",
    });
  }
};

const modificarImagen = async (req, res) => {
  try {
    await req.imagen.update(req.body);

    return res.status(200).json({
      message: "Imagen modificada con éxito",
    });
  } catch (error) {
    console.error("Error al modificar la imagen:", error);
    return res.status(500).json({
      message: "Error al intentar modificar la imagen",
    });
  }
};
const eliminarImagen = async (req, res) => {
  try {
    await req.imagen.destroy();
    return res.status(200).json({
      message: "Imagen eliminada con exito!",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};

module.exports = {
  obtenerImagenes,
  obtenerImagen,
  crearImagen,
  modificarImagen,
  eliminarImagen,
};
