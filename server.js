require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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

//IMPORT ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("error in db connection");
    console.log(err);
  });

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.disable("x-powered-by");

let users = new Map();

//socket io connection
io.on("connection", (socket) => {
  console.log("socket connected");
  const { contactNo, username } = socket.handshake.query;
  users.set(contactNo, socket.id);

  //listen to event send message
  //when a client sends a message
  socket.on("send-message", (messageBody) => {
    const newMesage = {
      ...messageBody,
      recipient: { recipientNo: contactNo },
      sender: { contactNo: contactNo },
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

//ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.get("/", (req, res) => {
  res.send("App is running");
});

const PORT = process.env.PORT;

server.listen(PORT || 8000, () =>
  console.log(`server is listening on port = ${PORT}`)
);
