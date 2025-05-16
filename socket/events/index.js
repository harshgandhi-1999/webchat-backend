const handleSocketEvent = require("../socketHandlerWrapper");
const sendMessage = require("./sendMessage");

module.exports = function registerSocketEvents(socket, io) {
  socket.on("send-message", handleSocketEvent(sendMessage(socket, io)));

  // Register more events
  // socket.on("some-event", handleSocketEvent(someOtherEvent(socket, io)));
};
