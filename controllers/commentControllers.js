const { Comment } = require("../models");

const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comment.findAll();

    const comentariosVisibles = comentarios.filter(
      (comentario) => comentario.visible,
    );

    return res.status(200).json(comentariosVisibles);
  } catch (error) {
    console.error("Error al obtener los comentarios:", error);

    return res.status(500).json({
      message: "Error al obtener los comentarios",
      error: error.message,
    });
  }
};

const obtenerComentario = async (req, res) => {
  try {
    res.status(200).json(req.comentario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el comentario" });
  }
};

const crearComentario = async (req, res) => {
  try {
    const comentario = await Comment.create(req.body);
    res
      .status(201)
      .json(comentario, { message: "Comentario creado con exito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el comentario",
    });
  }
};

const modificarComentario = async (req, res) => {
  try {
    await req.comentario.update(req.body);
    res.status(200).json({
      message: "Comentario modificado con exito",
    });
  } catch (error) {
    res.status(500).json({ message: "error al modifical al Comentario" });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    await req.comentario.destroy();
    res.status(200).json({
      message: "Comentario eliminado con éxito",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el comentario" });
  }
};

module.exports = {
  obtenerComentarios,
  obtenerComentario,
  modificarComentario,
  crearComentario,
  eliminarComentario,
};
