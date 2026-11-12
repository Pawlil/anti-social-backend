# UnaHur Anti-Social Net — Red Anti-Social

Backend REST para el trabajo práctico, desarrollado con Node.js, Express, Sequelize, SQLite y Joi.

## Requisitos

- Node.js (versión LTS recomendada).
- npm, incluido con Node.js.

## Instalación y ejecución

1. Abrir una terminal en la carpeta raíz del proyecto (`Trabajo-Practico-1-EDP`).
2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor:

   ```bash
   npm run dev
   ```

El servidor utiliza actualmente el puerto `3000`. La base SQLite de desarrollo se configura en `config/config.js` y se guarda en `data/anti-socialWEB.db`. Al iniciar, Sequelize sincroniza los modelos con la base configurada. El entorno `test` utiliza `data/anti-social-test.db` para separar los datos de prueba de los de desarrollo.

## Endpoints

| Método         | Ruta                             | Función                                                                  |
| -------------- | -------------------------------- | ------------------------------------------------------------------------ |
| GET/POST       | `/api/users`                     | Listar o crear usuarios                                                  |
| GET/PUT/DELETE | `/api/users/:id`                 | Consultar, modificar o eliminar un usuario                               |
| GET/POST       | `/api/posts`                     | Listar o crear publicaciones                                             |
| GET/PUT/DELETE | `/api/posts/:id`                 | Consultar, modificar o eliminar una publicación                          |
| POST           | `/api/posts/:id/images`          | Asociar una URL de imagen a una publicación                              |
| DELETE         | `/api/posts/:id/images/:imageId` | Quitar una imagen de una publicación                                     |
| POST           | `/api/posts/:id/tags`            | Asociar una etiqueta a una publicación                                   |
| DELETE         | `/api/posts/:id/tags/:tagId`     | Quitar una etiqueta de una publicación                                   |
| GET/POST       | `/api/comments`                  | Listar o crear comentarios                                               |
| GET/PUT/DELETE | `/api/comments/:id`              | Consultar, modificar o eliminar un comentario                            |
| GET/POST       | `/api/images`                    | Listar o crear registros de imágenes (al crear, enviar también `postId`) |
| GET/PUT/DELETE | `/api/images/:id`                | Consultar, modificar o eliminar una imagen                               |
| GET/POST       | `/api/tags`                      | Listar o crear etiquetas                                                 |
| GET/PUT/DELETE | `/api/tags/:id`                  | Consultar, modificar o eliminar una etiqueta                             |

Los cuerpos deben enviarse como JSON con `Content-Type: application/json`. Los errores de validación responden HTTP `400`, los recursos inexistentes HTTP `404` y un `nickName` duplicado HTTP `409`.

### Ejemplos de cuerpos JSON

Crear usuario:

```json
{
  "nickName": "caballero123"
}
```

Crear publicación:

```json
{
  "description": "Mi primera publicación",
  "userId": 1
}
```

Crear comentario:

```json
{
  "content": "¡Buen post!",
  "userId": 1,
  "postId": 1
}
```

Crear etiqueta:

```json
{
  "name": "universidad"
}
```

## Modelo de datos

El diagrama entidad-relación está en [`DER.md`](./DER.md). Cada usuario puede crear publicaciones y comentarios; cada publicación puede tener varias imágenes y comentarios; publicaciones y etiquetas se relacionan de muchos a muchos mediante `PostTag`.
