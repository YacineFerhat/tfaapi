const express = require("express");
const { check } = require("express-validator");
const globalUserController = require("../controllers/user");
const router = express.Router();

router.post("/createUser", globalUserController.createUser);
router.post("/login", globalUserController.login);

module.exports = router;
