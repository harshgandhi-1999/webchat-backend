require("dotenv").config();
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//creating instance of express
const app = express();

//creating server
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

let users = new Map();

//socket io connection
io.on("connection", (socket) => {
  console.log("socket connected");
  const { contactNo, name } = socket.handshake.query;
  // socket.join(contactNo);
  users.set(contactNo, socket.id);

  //listen to event send message
  //when a client sends a message
  socket.on("send-message", (messageBody) => {
    const newMesage = {
      ...messageBody,
      recipient: { recipientNo: contactNo, recipientName: name },
      sender: { contactNo: contactNo, name: name },
    };

    io.to(users.get(messageBody.recipient.recipientNo)).emit(
      "recieve-message",
      newMesage
    );
  });

  //server sends to client

  socket.on("disconnect", () => {
    users.delete(contactNo);
    console.log("client disconnected");
  });
});

const PORT = process.env.PORT;

server.listen(PORT || 8000, () =>
  console.log(`server is listening on port = ${PORT}`)
);
