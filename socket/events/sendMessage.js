const cacheClient = require("../../cache/cacheClient");

module.exports = (socket, io) => {
  return async function (data) {
    const { recipientId, content } = data;

    if (!recipientId) {
      throw new Error("Missing recipientId in message body");
    }

    let recipientSocketId = await cacheClient.get(recipientId);
    if (!recipientSocketId) {
      console.log("Recipient is offline");
      socket.emit("error", { code: 4002, message: "Recipient is offline" });
      return;
    }

    console.log("Sending message...");

    io.to(recipientSocketId).emit("recieve-message", {
      senderId: socket.senderId,
      content: content,
    });
  };
};
