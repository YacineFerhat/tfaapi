const mongoose = require("mongoose");

const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};

const userSchema = new Schema(
  {
    date: requiredString,
    paid: {
      type: Number,
      required: true,
    },
    refund: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
  {
    collection: "payments",
  }
);

module.exports = mongoose.model("Payment", userSchema);
