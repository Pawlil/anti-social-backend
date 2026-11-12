const { User, Post } = require("../models");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await req.usuario.reload({
      include: {
        model: Post,
        as: "Posts",
        attributes: ["description"],
      },
    });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nickName } = req.body;
    await User.create({
      nickName,
    });
    res.status(201).json({ message: "Usuario Creado con exito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el usuario",
      error: error.message,
    });
  }
};

const modificarUsuario = async (req, res) => {
  try {
    const { nickName } = req.body;
    await req.usuario.update({ nickName });
    res.status(200).json({
      message: "Usuario modificado con exito",
    });
  } catch (error) {
    res.status(500).json({ message: "error al modifical al usuario" });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await req.usuario.destroy();
    res.status(200).json({
      message: "Usuario eliminado con éxito",
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);

    return res.status(500).json({
      message: "Error al eliminar el usuario",
    });
  }
};

//---- follows

//los gets que implementamos de seguidos y seguidores
const obtenerSeguidos = async (req, res) => {
  try {
    const seguidos = await req.usuario.getSiguiendo({
      attributes: ["id", "nickName"],
    });
    return res.status(200).json(seguidos);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los usuario seguidos",
    });
  }
};

const obtenerSeguidores = async (req, res) => {
  try {
    const seguidores = await req.usuario.getSeguidores({
      attributes: ["id", "nickName"],
    });
    return res.status(200).json(seguidores);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los seguidores",
    });
  }
};

//post
const seguirUsuario = async (req, res) => {
  try {
    const { usuarioSeguidor, usuarioSeguido } = req;
    await usuarioSeguidor.addSiguiendo(usuarioSeguido);
    return res.status(200).json({ message: "Usuario seguido correctamente" });
  } catch (error) {
    console.error(error);
    console.error("Error al seguir usuario:", error);
    res.status(500).json({ message: "Error al seguir usuario." });
  }
};

//delete
const dejarDeSeguir = async (req, res) => {
  try {
    const { usuarioSeguidor, usuarioSeguido } = req;

    await usuarioSeguidor.removeSiguiendo(usuarioSeguido);

    res.status(200).json({ message: "Dejaste de seguir al usuario" });
  } catch (error) {
    console.error("Error al dejar de seguir:", error);
    res.status(500).json({ message: "Error al dejar de seguir" });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
  seguirUsuario,
  dejarDeSeguir,
  obtenerSeguidores,
  obtenerSeguidos,
};
