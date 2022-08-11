const { validationResult } = require("express-validator");
const userSchema = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { tokenKey } = require("../../config");

const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(405).json({ error: "Invalid inputs  " });
  }

  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await userSchema.findOne({
      email: email,
    });
  } catch (err) {
    console.log("cant access the server");
  }
  if (existingUser !== null) {
    res.status(405).json({ error: "user already exist" });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log("cant create the hashed password");
  }

  const createUser = new userSchema({
    email,
    password: hashedPassword,
  });
  console.log(createUser);
  try {
    await createUser.save();
  } catch (err) {
    console.log(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUser._id, email: createUser.email },
      tokenKey,
      { expiresIn: "1d" }
    );
  } catch (err) {
    res.status(501).json({ error: "Creation of the token failed" });
    return next(error);
  }
  res.status(201).json({
    userId: createUser._id,
    token: token,
    userData: createUser,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await userSchema.findOne({ email: email });
  } catch (err) {
    res.status(500).json({ error: "couldnt execute the request" });
  }
  if (!existingUser) {
    res.status(500).json({ error: "User not found" });
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    res.status(500).json({ error: "Couldnt check for the password" });
  }
  if (!isValidPassword) {
    res.status(500).json({ error: "The password is invalid" });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUser._id, email: createUser.email },
      tokenKey,
      { expiresIn: "1d" }
    );
  } catch (err) {
    res.status(500).json({ error: "Couldnt create the token" });
  }
  res.status(201).json({
    userId: existingUser._id,
    token: token,
  });
};

exports.login = login;
exports.createUser = createUser;
