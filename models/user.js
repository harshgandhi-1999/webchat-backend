const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
