const mongoose = require("mongoose");

const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

const userSchema = new Schema(
  {
    email: requiredString,
    password: requiredString,

  },
  {
    timestamps: true,
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
