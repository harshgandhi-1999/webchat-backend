const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  sender: {
    type: String,
  },
  recipient: {
    type: String,
  },
  message: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// const conversations = new mongoose.Schema({
//   messages: [messageSchema],
// });

module.exports = mongoose.model("Conversation", conversationSchema);
