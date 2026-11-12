const { Router } = require("express");
const router = Router();
const validarId = require("../middlewares/validarId");
const validarSchema = require("../middlewares/validarSchema");
const validarRelacionesComentario = require("../middlewares/validarRelacionesComentario");
const {
  commentSchema,
  commentContentSchema,
} = require("../schemas/commentSchemas");
const verificarSiElComentarioExiste = require("../middlewares/Comment/verificarSiElComentarioExiste");
const verificarComentarioPorId = require("../middlewares/Comment/verificarComentarioPorId");

const {
  obtenerComentarios,
  obtenerComentario,
  crearComentario,
  modificarComentario,
  eliminarComentario,
} = require("../controllers/commentControllers");

router.get("/", obtenerComentarios);
router.get("/:id", validarId, verificarSiElComentarioExiste, obtenerComentario);
router.post(
  "/",
  validarSchema(commentSchema),
  validarRelacionesComentario,
  crearComentario,
);
router.put(
  "/:id",
  validarId,
  validarSchema(commentContentSchema),
  verificarSiElComentarioExiste,
  modificarComentario,
);
router.delete("/:id", validarId, verificarComentarioPorId, eliminarComentario);

module.exports = router;
