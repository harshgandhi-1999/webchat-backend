let users = new Map();

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Client connected with id : ", socket.id);

    const { contactNo, username } = socket.handshake.query;
    users.set(contactNo, socket.id);

    registerUserHandler(io, socket, users);

    socket.on("disconnect", () => {
      users.delete(contactNo);
      console.log("client disconnected");
    });
  });
};
