require('dotenv').config();
const fs = require('fs');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      bigNumberStrings: true,
      connectTimeout:process.env.DB_TIMEOUT,
    },
  },
  production: {
    use_env_variable: "DATABASE_URL"
  }
};
