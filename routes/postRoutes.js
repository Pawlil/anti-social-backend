const { Router } = require("express");
const router = Router();
const validarId = require("../middlewares/validarId");
const validarSchema = require("../middlewares/validarSchema");
const { postSchema, postActualizarSchema } = require("../schemas/postSchemas");
const { post_ImageAnidadaSchema } = require("../schemas/post_ImagesSchemas");
const { tagAssociationSchema } = require("../schemas/tagSchemas");
const verificarSiElUsuarioExiste = require("../middlewares/User/verificarSiElUsuarioExiste");
const verificarSiElPostExiste = require("../middlewares/Post/validarSiElPostExiste");
const verificarSiElTagExiste = require("../middlewares/Tag/verificarSiElTagExiste");
const validarTagId = require("../middlewares/Tag/validarTagId");
const validarImageId = require("../middlewares/Post_Image/validarImagenId");
const verificarSiLaImagenExiste = require("../middlewares/Post_Image/verificarSiLaImagenExiste");
const verificarTagNoAsociado = require("../middlewares/Tag/verificarTagNoAsociado");

const {
  obtenerPosts,
  obtenerPost,
  crearPost,
  modificarPost,
  eliminarPost,
  agregarImagen,
  eliminarImagen,
  agregarTag,
  eliminarTag,
} = require("../controllers/postControllers");
const verificarTagAsociado = require("../middlewares/Tag/verificarTagAsociado");

router.get("/", obtenerPosts);
router.get("/:id", validarId, verificarSiElPostExiste, obtenerPost);
router.post(
  "/",
  validarSchema(postSchema),
  verificarSiElUsuarioExiste,
  crearPost,
);
router.put(
  "/:id",
  validarId,
  verificarSiElPostExiste,
  validarSchema(postActualizarSchema),
  modificarPost,
);
router.delete("/:id", validarId, verificarSiElPostExiste, eliminarPost);

//endpoint para manejar las imagenes
router.post(
  "/:id/images",
  validarId,
  verificarSiElPostExiste,
  validarSchema(post_ImageAnidadaSchema),
  agregarImagen,
);
router.delete(
  "/:id/images/:imageId",
  validarId,
  verificarSiElPostExiste,
  validarImageId,
  verificarSiLaImagenExiste,
  eliminarImagen,
);
//endpoint para agregar y quietar los tags
router.post(
  "/:id/tags",
  validarId,
  verificarSiElPostExiste,
  validarSchema(tagAssociationSchema),
  verificarSiElTagExiste,
  agregarTag,
);
router.delete(
  "/:id/tags/:tagId",
  validarId,
  validarTagId,
  verificarSiElPostExiste,
  verificarSiElTagExiste,
  verificarTagAsociado,
  eliminarTag,
);

module.exports = router;
