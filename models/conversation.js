const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
    recipient: {
      type: String,
    },
    message: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    participants: [String],
  },
  {
    timestamps: true,
  }
);

// const conversations = new mongoose.Schema({
//   messages: [messageSchema],
// });

module.exports = mongoose.model("Conversation", conversationSchema);
