const { userSchema } = require("../schemas/userSchemas");
const { Router } = require("express");
const router = Router();
const validarId = require("../middlewares/validarId");
const verificarSiElUsuarioExiste = require("../middlewares/User/verificarSiElUsuarioExiste");
const validarSchema = require("../middlewares/validarSchema");
const verificarSiNickNameEsUnico = require("../middlewares/User/verificarSiNickNameEsUnico");
const verificarRelacionesUser = require("../middlewares/User/validarRelacionesUser");
const verificarNickUnico = require("../middlewares/User/verificarNickUnico");

const {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario,
  seguirUsuario,
  dejarDeSeguir,
  obtenerSeguidos,
  obtenerSeguidores,
} = require("../controllers/userControllers");
const verificarIdFollow = require("../middlewares/User/verificarIdFollows");
const validarUsuarioSeguido = require("../middlewares/User/validarUsuariosSeguido");
const verificarNoSeguirseASiMismo = require("../middlewares/User/verificarNoSeguirseASiMismo");
const verificarNickDisponible = require("../middlewares/User/verificarNickDisponible");

router.get("/", obtenerUsuarios);
router.get("/:id", validarId, verificarSiElUsuarioExiste, obtenerUsuario);
router.post("/", validarSchema(userSchema), verificarNickUnico, crearUsuario);
router.put(
  "/:id",
  validarId,
  verificarSiElUsuarioExiste,
  validarSchema(userSchema),
  verificarSiNickNameEsUnico,
  verificarNickDisponible,
  modificarUsuario,
);
router.delete(
  "/:id",
  validarId,
  verificarSiElUsuarioExiste,
  verificarRelacionesUser,
  eliminarUsuario,
);

// Parte de los followers
router.delete(
  "/:followerId/unfollow/:followedId",
  verificarIdFollow,
  verificarNoSeguirseASiMismo,
  validarUsuarioSeguido,
  dejarDeSeguir,
);
router.post(
  "/:followerId/follow/:followedId",
  verificarIdFollow,
  verificarNoSeguirseASiMismo,
  validarUsuarioSeguido,
  seguirUsuario,
);
//este es el get para ver los usuarios que sigen a un usuario
router.get(
  "/:id/siguiendo",
  validarId,
  verificarSiElUsuarioExiste,
  obtenerSeguidos,
);
//Y este es el get para obtener los seguidores de un usuario
router.get(
  "/:id/seguidores",
  validarId,
  verificarSiElUsuarioExiste,
  obtenerSeguidores,
);

module.exports = router;
