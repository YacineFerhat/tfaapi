const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  dbUrl: process.env.DB_CONNECT,
  tokenKey: process.env.SECRET_KEY_TOKEN,
  port: process.env.PORT,
};
