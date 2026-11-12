# Feedback del Trabajo Práctico

**Equipo:** Grupo 22 — `ejercicio-48-grupo-22`

## Integrantes y participación

| Integrante             | Usuario              | Commits |
| ---------------------- | -------------------- | ------: |
| Juan Ignacio Schmidt   | `juanischmidt1998`   |       6 |
| Naara Milena Ponce     | `naaru2246`          |       3 |
| Martín Gonzalo Staccia | `martin.staccia`     |       2 |
| Alan Ezequiel Valdez   | `alanezequielvaldez` |       2 |

Los cuatro integrantes registran commits.

---

## Resumen General

¡Buen trabajo, equipo! 👏 La entrega tiene las cinco entidades principales, la relación muchos a muchos entre publicaciones y etiquetas y una separación clara entre routes, controllers, middlewares, schemas y models. Implementaron un atributo virtual para calcular la visibilidad, middlewares de existencia y controles para evitar borrar usuarios con publicaciones o comentarios. También investigaron Swagger, entregaron una colección de Postman y avanzaron con el bonus de followers.

Las pruebas encontraron problemas importantes que hay que corregir para completar el MVP: **los comentarios antiguos siguen apareciendo al consultar posts y la eliminación de imágenes puede borrar una imagen de otra publicación**. Además, se pueden crear imágenes sin post, modificar URLs sin pasar por Joi y obtener errores 500 en situaciones que deberían ser errores de entrada o de conflicto.

La documentación existe, pero describe rutas diferentes de las que realmente expone el servidor. La colección tiene 28 pedidos, algunos de error, aunque no cubre todos los endpoints ni contiene verificaciones automáticas. A continuación se detallan los aciertos y las correcciones prioritarias.

## Fortalezas

1. **Separación de responsabilidades y validación con middlewares**
   Las rutas componen `validarSchema`, validaciones de identificadores y búsquedas de recursos antes de invocar al controlador. Varios middlewares guardan la instancia encontrada en `req.usuario`, `req.post`, `req.imagen` o `req.tag`, lo que permite reutilizarla. La estructura muestra que entendieron el propósito de los middlewares en Express.

2. **Modelo relacional y asociaciones principales**
   `models/user.js`, `post.js`, `comment.js`, `post_images.js` y `tag.js` representan las relaciones del dominio. `nickName` tiene una restricción única en el modelo y Post–Tag se implementa con `belongsToMany`. Respetaron el nombre `Post_Images`. `DER.md` y `assets/DER.jpg` permiten identificar las entidades y sus relaciones.

3. **Atributo virtual correctamente definido como dato calculado**
   `models/comment.js:41-63` define `visible` con `DataTypes.VIRTUAL`, usando la fecha de creación y `COMMENT_MAX_AGE_MONTHS`. Un comentario de 2020 se calculó como `visible: false`, y `GET /comment` lo excluyó. El cálculo existe y no se persiste; falta aplicarlo también a los comentarios incluidos en los posts.

4. **Control claro para el borrado de usuarios con dependencias**
   `middlewares/User/validarRelacionesUser.js` cuenta publicaciones y comentarios antes de eliminar. En la prueba, un usuario con posts recibió **409** con una explicación y las cantidades asociadas. Es una política válida y evita convertir esa situación en un error genérico de base de datos.

5. **Comprobación de referencias en la creación de posts y comentarios**
   Al crear un post se verifica que exista el usuario. Antes de crear un comentario, `validarRelacionesComentario` comprueba autor y publicación. Los casos con referencias inexistentes probados respondieron 404. La descripción ausente también se rechaza con 400.

6. **Configuración de conexión por entorno y Swagger accesible**
   `config/config.js` lee dialecto, almacenamiento y datos de conexión desde variables de entorno. `/api-docs/` respondió 200 y carga la especificación YAML. La documentación y la colección constituyen una base para seguir verificando la API, aunque necesitan los ajustes indicados abajo.

---

## Observaciones

### Funcionalidad / Requerimientos

### Los comentarios antiguos se siguen mostrando al consultar publicaciones

**Estado:** ❌  
**Severidad:** 🔴 Alta  
**Ubicación:** `controllers/postControllers.js:3-42`; `middlewares/Post/validarSiElPostExiste.js:5-33`; `models/comment.js:41-63`.

**Descripción:** El virtual calcula correctamente que un comentario antiguo no es visible, pero `GET /post` y `GET /post/:id` devuelven todos los comentarios incluidos. Se cambió mediante Sequelize la fecha de un comentario a 2020: ambas consultas siguieron devolviéndolo con `visible: false`. El listado `/comment`, en cambio, sí lo filtró.

**Impacto:** Se incumple una regla explícita del enunciado: los comentarios antiguos no deben mostrarse al consultar un post. Informar que no son visibles no equivale a excluirlos de la respuesta.

**Recomendación:** Aplicar el atributo virtual antes de serializar la respuesta en ambos recorridos y reutilizar una función común:

```js
const conComentariosVisibles = (post) => {
  const data = post.toJSON();
  data.comments = post.comments
    .filter((comment) => comment.visible)
    .map((comment) => comment.toJSON());
  return data;
};
```

Usarla en el listado y en el detalle. Agregar una prueba con un comentario reciente y otro antiguo en la misma publicación, cambiando X para comprobar la configuración.

### El borrado de imágenes usa el id del post y no verifica la pertenencia

**Estado:** ❌  
**Severidad:** 🔴 Alta  
**Ubicación:** `routes/postRoutes.js:54-60`; `middlewares/Post_Image/verificarSiLaImagenExiste.js:5`; `controllers/postControllers.js:97-102`.

**Descripción:** La ruta `DELETE /post/:id/images/:imageId` valida el formato de `imageId`, pero el middleware busca la imagen con `req.params.id`, que es el identificador del post. Tampoco comprueba `postId`. En la prueba se pidió borrar desde el post 3 una imagen con id 3 que pertenecía al post 4: respondió **200 y eliminó la imagen del post 4**.

**Impacto:** Se puede eliminar una imagen ajena a la publicación indicada. Además, si el id del post y el de la imagen deseada son diferentes, se consulta un registro incorrecto.

**Recomendación:** Para esa relación buscar por ambos identificadores:

```js
const imagen = await Post_Images.findOne({
  where: { id: req.params.imageId, postId: req.params.id },
});
if (!imagen) {
  return res.status(404).json({ message: "Imagen no encontrada en este post" });
}
req.imagen = imagen;
next();
```

Mantener una búsqueda independiente por `:id` para `/postImage/:id`. Agregar pruebas donde los identificadores sean diferentes y donde la imagen pertenezca a otro post.

### Modelado y validaciones de imágenes

### Se pueden crear imágenes sin publicación y con referencias inválidas

**Estado:** ❌  
**Severidad:** 🟠 Media  
**Ubicación:** `routes/post_ImagesRoutes.js:20`; `schemas/post_ImagesSchemas.js:10`; `models/post_images.js:11-14`.

**Descripción:** El POST a `/postImage` marca `postId` como opcional y no usa el middleware de existencia del post. La FK generada permite null. Crear una imagen solo con URL respondió **201** y se comprobó que quedó guardada con `postId: null`. Enviar un post inexistente terminó en **500** por restricción de base.

**Impacto:** Se admiten imágenes que no están asociadas a una publicación y los errores de referencia no se comunican de forma clara.

**Recomendación:** Separar el schema de creación independiente del schema de la ruta anidada. En `/postImage`, exigir `postId` y verificar que exista antes de escribir. En `/post/:id/images`, obtenerlo del parámetro. Declarar la FK con `allowNull: false`, salvo que se justifique y diseñe expresamente un flujo de imágenes pendientes de asociación.

### El PUT de imágenes no valida el body ni comprueba que exista la imagen

**Estado:** ❌  
**Severidad:** 🟠 Media  
**Ubicación:** `routes/post_ImagesRoutes.js:21`; `middlewares/validarRelacionImagen.js`; `controllers/post_ImagesControllers.js:31-40`.

**Descripción:** La actualización solo valida el id de ruta y consulta el post indicado en el body. No aplica Joi ni comprueba que exista la imagen antes de actualizar. Se reprodujeron estos casos:

- Una imagen existente se actualizó con `url: "no-es-url"` y respondió **200**. El valor inválido quedó guardado.
- Una imagen inexistente, con post válido, respondió **500**.
- Cambiar solo la URL, sin `postId`, respondió **404** indicando que no existe la publicación asociada.

**Impacto:** La actualización permite datos que el alta rechaza, confunde ausencia de campos con inexistencia de recursos y puede terminar en errores internos evitables.

**Recomendación:** Aplicar un schema de actualización y un middleware de existencia de imagen. Si solo se modifica la URL, no exigir nuevamente el post. Si se permite cambiar `postId`, validarlo y comprobar su existencia únicamente cuando esté presente. Limitar los campos que se pueden modificar.

### Integridad y respuestas HTTP

### Los posts con comentarios no se pueden eliminar y las imágenes pueden quedar huérfanas

**Estado:** ⚠️  
**Severidad:** 🟠 Media  
**Ubicación:** `models/post.js:16-24`; `models/comment.js:21-24`; `models/post_images.js:11-14`; `controllers/postControllers.js:75-80`.

**Descripción:** Las asociaciones no fijan una política coherente de borrado. En la base creada desde los modelos, los comentarios tienen `ON DELETE NO ACTION` y las imágenes `ON DELETE SET NULL`. Al intentar borrar un post con comentarios, la API respondió **500 “Error al eliminar el posteo”**.

**Impacto:** Una operación habitual falla sin explicar sus dependencias. Si se conserva SET NULL para imágenes, el modelo permite registros que ya no pertenecen a ningún post.

**Recomendación:** Definir la política. Para imágenes y comentarios dependientes del post, una cascada es una opción razonable. Si se decide restringir el borrado, responder 409 con una explicación y documentarlo. Alinear las FKs y su nulabilidad con esa decisión y probar el borrado con relaciones cargadas.

### El nick duplicado responde 500 al crear usuarios

**Estado:** ⚠️  
**Severidad:** 🟠 Media  
**Ubicación:** `routes/userRoutes.js:28-35`; `controllers/userControllers.js:29-40`.

**Descripción:** La restricción única protege la base. Sin embargo, el POST no usa el middleware de unicidad ni trata `SequelizeUniqueConstraintError`: repetir un nick respondió **500 “Validation error”**. En el PUT, el middleware sí funciona y el duplicado respondió **409**.

**Impacto:** La misma regla del dominio se informa de manera diferente según la operación.

**Recomendación:** Capturar la restricción única y devolver 409 también al crear. Reutilizar la comprobación previa si se desea, pero conservar siempre el tratamiento del error de base, porque dos pedidos concurrentes pueden superar un chequeo previo.

### Validaciones

### Se aceptan descripciones con espacios y faltan controles en las actualizaciones

**Estado:** ⚠️  
**Severidad:** 🟠 Media  
**Ubicación:** `schemas/postSchemas.js:3-21`; `schemas/commentSchemas.js`; `schemas/userSchemas.js`; `routes/postRoutes.js:37-42`.

**Descripción:** Los strings no se recortan antes de medir su longitud. Un post con `description: "   "` se creó con **201**. El schema de update hace opcionales todos los campos, pero no exige al menos uno: `{}` respondió 200 sin cambios. También permite modificar `userId` sin comprobar el nuevo usuario; un id inexistente terminó en 500.

**Impacto:** La descripción puede no tener contenido real y la actualización no mantiene las mismas garantías que el alta.

**Recomendación:** Usar `.trim().min(1)` en los campos de texto obligatorios, incorporar `.min(1)` al objeto de actualización y decidir si el autor puede cambiarse. Si no corresponde cambiarlo, quitar `userId` del schema de update; si se permite, verificar la nueva referencia. Alinear también el máximo de descripción: Joi admite 300 caracteres y el modelo usa `STRING` sin longitud explícita, habitualmente 255.

### La ausencia de body pasa Joi y termina en 500

**Estado:** ❌  
**Severidad:** 🟠 Media  
**Ubicación:** `middlewares/validarSchema.js:3-6`.

**Descripción:** El objeto raíz no es obligatorio. Joi acepta `undefined` y los controladores o los middlewares siguientes intentan leer sus propiedades. Los POST sin body a `/user`, `/post`, `/tag`, `/comment` y `/postImage` respondieron **500**.

**Impacto:** Una petición incompleta se presenta como fallo interno y en algunos casos se expone el mensaje técnico de JavaScript.

**Recomendación:** Validar el objeto raíz como obligatorio o reemplazar una ausencia de body por `{}` antes de validar:

```js
const { error, value } = schema.required().validate(req.body, {
  abortEarly: false,
  stripUnknown: true,
});
```

Responder 400 y agregar este caso a la colección. El uso de `stripUnknown: true` descarta campos extra; es una decisión posible, pero conviene documentarla para que el cliente sepa que esos campos no se procesan.

### Bonus: followers

### Una ruta duplicada impide ejecutar las validaciones de seguimiento

**Estado:** ❌  
**Severidad:** 🟠 Media dentro del bonus  
**Ubicación:** `routes/userRoutes.js:26` y `:53-58`; `controllers/userControllers.js:101-109`; `models/follow.js`; `models/user.js:20-32`.

**Descripción:** El mismo POST `/:followerId/follow/:followedId` está declarado dos veces. La primera declaración invoca directamente el controlador, antes de la versión que carga `req.usuarioSeguidor` y `req.usuarioSeguido`. Por eso seguir a otro usuario y seguirse a sí mismo respondieron **500**. La segunda cadena no llega a ejecutarse.

Además, las asociaciones de User usan el through generado `Follows`, mientras `models/follow.js` define otro modelo con nicknames y `followingId`. Son dos definiciones distintas para el seguimiento. La asociación `addSiguiendo` sí pudo ejecutarse directamente con usuarios existentes, por lo que el primer bloqueo está en el recorrido de la ruta.

**Impacto:** El bonus no funciona desde su endpoint principal y sus validaciones quedan sin efecto.

**Recomendación:** Eliminar la primera declaración y conservar una sola ruta con todos sus middlewares. Unificar el modelo de seguimiento y los nombres de sus FKs; quitar la definición redundante si se usa la tabla generada. Probar seguir, repetir, auto-seguimiento, ids inválidos, usuarios inexistentes y dejar de seguir.

### Documentación y pruebas

### Swagger y las instrucciones describen rutas que el servidor no expone

**Estado:** ❌  
**Severidad:** 🟠 Media  
**Ubicación:** `src/main.js:23-27`; `docs/openapi.yaml`, secciones `servers` y `paths`; `README_INSTRUCCIONES.md:25-44`; `README.md`.

**Descripción:** La API real usa `/user`, `/post`, `/comment`, `/tag` y `/postImage`. Swagger declara el servidor `http://localhost:3000/api` y paths como `/users` y `/posts`, por lo que genera URLs como `/api/users`. Las instrucciones repiten esas rutas diferentes y mencionan `config/config.json`, aunque la configuración actual está en `config/config.js`. El README principal conserva la consigna y no presenta primero la guía de instalación.

**Impacto:** La interfaz de Swagger abre, pero el contrato documentado no permite probar correctamente la API. Quien sigue las instrucciones tampoco encuentra las mismas rutas del código.

**Recomendación:** Elegir un contrato de rutas y hacerlo coincidir entre Express, README y colección. No es obligatorio cambiar singular por plural: lo indispensable es que coincidan. Usar una URL relativa en `servers` para respetar el puerto configurado. Llevar las instrucciones al README principal o enlazarlas claramente, e incluir el paso de configuración de `.env`.

### La colección no cubre todas las operaciones ni comprueba las reglas principales

**Estado:** ⚠️  
**Severidad:** 🟠 Media  
**Ubicación:** `Anti-Social API.postman_collection.json`.

**Descripción:** Tiene **28 pedidos**, incluidos algunos casos de error, y usa URLs e ids fijos. No incluye scripts de verificación automática. Faltan recorridos, como el borrado directo de usuario, post, comentario y tag y las operaciones del bonus. Algunos nombres no coinciden con su contenido: “put user” apunta a `/comment/2` y “Delete post tag” usa POST.

**Impacto:** La colección permite probar parte de la API, pero no cumple la cobertura de todos los endpoints y no comprueba la visibilidad de comentarios ni la pertenencia de imágenes.

**Recomendación:** Agregar los endpoints faltantes y corregir nombres, métodos y rutas. Usar una variable `baseUrl` e ids obtenidos de los recursos creados. Incorporar casos de comentarios antiguos, borrado de imágenes de otro post, datos inválidos en PUT, nick duplicado y borrados con dependencias. Las assertions automáticas son una mejora útil; su ausencia no es por sí sola un incumplimiento del enunciado.

### El DER, las migraciones y los modelos necesitan una revisión conjunta

**Estado:** ⚠️  
**Severidad:** 🟡 Baja  
**Ubicación:** `DER.md`; `assets/DER.jpg`; `migrations/`; `.sequelizerc`; `models/`.

**Descripción:** El DER es una base útil, pero el texto menciona `Post_Images.Url` y el modelo usa `url`. Las migraciones conservan atributos y restricciones diferentes: por ejemplo, Post tiene `Description` y carece de la FK a User, y Comment no define sus relaciones. `.sequelizerc` apunta a carpetas bajo `src/`, mientras config, models y migrations están en la raíz.

**Impacto:** Hay varias representaciones del esquema que no coinciden. Aunque el arranque actual usa `sync`, quien intente usar Sequelize CLI o las migraciones no obtiene el modelo descrito.

**Recomendación:** Elegir y documentar el mecanismo para crear la base. Si se mantienen migraciones, corregir rutas, atributos, claves y restricciones y comprobarlas desde cero. Si no se usan, quitarlas para evitar confusión: no eran obligatorias. Actualizar el DER con el modelo que realmente quede implementado, incluido el seguimiento.

## Conclusión

Equipo, hay una base de trabajo valiosa: separaron responsabilidades, implementaron las relaciones y construyeron varios middlewares que comprueban existencia y restricciones antes de operar. También avanzaron con documentación y un bonus que muestra investigación adicional.

La prioridad es **cumplir el filtrado de comentarios en los posts y corregir la eliminación de imágenes**, porque afectan una regla central y la integridad de los datos. Después, completar las validaciones de alta y actualización, tratar los conflictos con códigos adecuados y hacer coincidir documentación y API. Conviene corregir la ruta duplicada del bonus una vez afianzados esos recorridos del MVP.

Aprovechen las piezas que ya tienen y prueben cada operación con datos válidos, referencias inexistentes y recursos relacionados. Eso les va a permitir consolidar la implementación y detectar estos cruces entre rutas, middlewares y modelos. ¡A seguir trabajando! 💪
