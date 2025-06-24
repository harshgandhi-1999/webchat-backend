const mongoose = require("mongoose");

const contactListSchema = new mongoose.Schema({
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  aliasName: String,
});

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
    contactList: {
      type: [contactListSchema],
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
