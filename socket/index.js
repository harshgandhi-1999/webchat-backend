const { Server } = require("socket.io");
const registerSocketEvents = require("./events");
const cacheClient = require("../cache/cacheClient");

module.exports = function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    },
  });

  // Middleware to validate senderId before connection
  io.use((socket, next) => {
    const { senderId } = socket.handshake.query;

    if (!senderId) {
      console.warn("Connection rejected: senderId is missing");
      const err = new Error(
        JSON.stringify({
          code: 4001,
          message: "Missing senderId in query params",
        })
      );
      return next(err);
    }

    // Optionally: store senderId in socket object
    socket.senderId = senderId;

    next(); // allow connection
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    const senderId = socket.senderId;

    cacheClient.set(senderId, socket.id);
    registerSocketEvents(socket, io);

    socket.on("disconnect", (reason) => {
      cacheClient.del(senderId);
      console.log(`Client disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  return io;
};
