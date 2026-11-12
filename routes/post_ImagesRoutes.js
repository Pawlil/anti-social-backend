const { Router } = require("express");
const router = Router();
const validarId = require("../middlewares/validarId");
const validarSchema = require("../middlewares/validarSchema");
const validarSiLaImagenEExiste = require("../middlewares/Post_Image/verificarSiLaImagenExiste");
const validarRelacionImagen = require("../middlewares/validarRelacionImagen");
const {
  post_ImageSchema,
  post_ImageUpdateSchema,
} = require("../schemas/post_ImagesSchemas");
const validarImagenPorId = require("../middlewares/Post_Image/validarImagenPorId");

const {
  obtenerImagenes,
  obtenerImagen,
  crearImagen,
  modificarImagen,
  eliminarImagen,
} = require("../controllers/post_ImagesControllers");

router.get("/", obtenerImagenes);
router.get("/:id", validarId, validarSiLaImagenEExiste, obtenerImagen);
router.post(
  "/",
  validarSchema(post_ImageSchema),
  validarRelacionImagen,
  crearImagen,
);
router.put(
  "/:id",
  validarId,
  validarSchema(post_ImageUpdateSchema),
  validarImagenPorId,
  validarRelacionImagen,
  modificarImagen,
);
router.delete("/:id", validarId, validarImagenPorId, eliminarImagen);

module.exports = router;
