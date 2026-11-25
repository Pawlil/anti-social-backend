require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const routerUser = require("../routes/userRoutes");
const routerPost = require("../routes/postRoutes");
const routerTag = require("../routes/tagRoutes");
const routerComment = require("../routes/commentRoutes");
const routerPostImages = require("../routes/post_ImagesRoutes");

const db = require("../models");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load(
  require("path").join(__dirname, "../docs/openapi.yaml"),
);

const PORT = process.env.PORT;

app.set("json spaces", 2);
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/user", routerUser);
app.use("/post", routerPost);
app.use("/tag", routerTag);
app.use("/comment", routerComment);
app.use("/postImage", routerPostImages);

app.listen(PORT, async () => {
  try {
    await db.sequelize.sync({});
    console.log(`La aplicacion esta en el puerto http://localhost:${PORT}...`);
  } catch (error) {
    console.error("no se puedo acceder a la base de datos:", error);
  }
});
