const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const projectRoot = path.resolve(__dirname, "..");

function createConfig() {
  const dialect = (process.env.DB_DIALECT || "sqlite").toLowerCase();

  const config = {
    dialect,
    database: process.env.DB_NAME || "tienda",
    username: process.env.DB_USER || undefined,
    password: process.env.DB_PASSWORD || undefined,
    host: process.env.DB_HOST || undefined,
    logging: process.env.DB_LOGGING === "true" ? console.log : false,
  };

  if (process.env.DB_PORT) {
    config.port = Number(process.env.DB_PORT);
  }

  if (dialect === "sqlite") {
    const storage = process.env.DB_STORAGE || "./src/data/tienda.db";

    config.storage = path.isAbsolute(storage)
      ? storage
      : path.resolve(projectRoot, storage);
    console.log("Base SQLite:", config.storage);
  }

  return config;
}

module.exports = {
  development: createConfig(),
  test: createConfig(),
  production: createConfig(),
};
