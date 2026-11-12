const { Tag } = require("../models");

const obtenerTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los tags" });
  }
};

const obtenerTag = async (req, res) => {
  try {
    return res.status(200).json(req.tag);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el tag" });
  }
};

const crearTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ message: "Tag Creado con exito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el tag",
    });
  }
};

const modificarTag = async (req, res) => {
  try {
    await req.tag.update(req.body);
    res.status(200).json({
      message: "tag modificado con exito",
    });
  } catch (error) {
    res.status(500).json({ message: "error al modifical al tag" });
  }
};

const eliminarTag = async (req, res) => {
  try {
    await req.tag.destroy();
    res.status(200).json({
      message: "Tag eliminado con éxito",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el tag" });
  }
};

module.exports = {
  obtenerTags,
  obtenerTag,
  modificarTag,
  eliminarTag,
  crearTag,
};
