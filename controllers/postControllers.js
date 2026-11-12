const { Post, User, Post_Images, Tag, Comment } = require("../models");

const obtenerPosts = async (req, res) => {
  try {
    const posteos = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nickName"],
        },
        {
          model: Tag,
          as: "tags",
        },
        {
          model: Post_Images,
          as: "images",
          attributes: ["id", "url", "postId"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "nickName"],
            },
          ],
        },
      ],
    });

    const posteosVisibles = posteos.map((post) => {
      const data = post.toJSON();
      data.comments = post.comments
        .filter((comment) => comment.visible)
        .map((comment) => comment.toJSON());

      return data;
    });

    return res.status(200).json(posteosVisibles);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los posteos" });
  }
};

const obtenerPost = async (req, res) => {
  try {
    const post = req.post.toJSON();

    post.comments = req.post.comments
      .filter((comment) => comment.visible)
      .map((comment) => comment.toJSON());

    return res.status(200).json(post);
  } catch (error) {
    return res.status(404).json({
      error: "Error al obtener el posteo",
    });
  }
};

const crearPost = async (req, res) => {
  try {
    const { description, userId } = req.body;
    const posteo = await Post.create({
      description,
      userId,
    });
    return res.status(201).json(posteo);
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la publicación",
    });
  }
};

const modificarPost = async (req, res) => {
  try {
    const posteo = req.post;
    await posteo.update(req.body);
    return res.status(200).json({ message: "posteo actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "error al modifical el posteo" });
  }
};

const eliminarPost = async (req, res) => {
  try {
    await req.post.destroy();

    return res.status(200).json({
      message: "posteo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar el posteo:", error);

    return res.status(500).json({
      message: "Error al eliminar el posteo",
    });
  }
};

// endspoints de la parte de agregar imagenes
const agregarImagen = async (req, res) => {
  try {
    const imagen = await Post_Images.create({
      url: req.body.url,
      postId: req.post.id,
    });
    return res.status(201).json(imagen);
  } catch (error) {
    return res.status(500).json({ message: "Error al subir la imagen" });
  }
};

const eliminarImagen = async (req, res) => {
  try {
    await req.imagen.destroy();
    return res.status(200).json({
      mensaje: "La imagen del posteo ah sido eliminada con exito",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};

//Endpoints de los tagss

const agregarTag = async (req, res) => {
  try {
    await req.post.addTag(req.tag);
    return res.status(200).json({
      mensaje: "Tag agregado con exito",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar un tag" });
  }
};

const eliminarTag = async (req, res) => {
  try {
    await req.post.removeTag(req.tag);
    return res.status(200).json({
      mensaje: "Tag eliminado con exito",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar un tag" });
  }
};

module.exports = {
  obtenerPosts,
  obtenerPost,
  crearPost,
  modificarPost,
  eliminarPost,
  agregarImagen,
  eliminarImagen,
  agregarTag,
  eliminarTag,
};
