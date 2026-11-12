const { Router } = require("express");
const router = Router();
const validarId = require("../middlewares/validarId");
const validarSchema = require("../middlewares/validarSchema");
const { tagSchema } = require("../schemas/tagSchemas");
const verificarTagPorId = require("../middlewares/Tag/verificarTagPorId");

const {
  obtenerTags,
  obtenerTag,
  crearTag,
  modificarTag,
  eliminarTag,
} = require("../controllers/tagControllers");

router.get("/", obtenerTags);
router.get("/:id", validarId, verificarTagPorId, obtenerTag);
router.post("/", validarSchema(tagSchema), crearTag);
router.put(
  "/:id",
  validarId,
  validarSchema(tagSchema),
  verificarTagPorId,
  modificarTag,
);
router.delete("/:id", validarId, verificarTagPorId, eliminarTag);

module.exports = router;
