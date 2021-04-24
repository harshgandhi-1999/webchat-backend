require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const Conversation = require("./models/conversation");

//creating instance of express
const app = express();
//creating server
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  },
});

//IMPORT ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const conversationRoutes = require("./routes/conversation");

// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGODBPROD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("error in db connection");
    console.log(err);
  });

// const db = mongoose.connection;

// db.once("open", () => {
//   const convoCollection = db.collection("conversations");
//   const changeStream = convoCollection.watch();

//   changeStream.on("change", (change) => {
//     if (change.operationType === "insert") {
//       io.emit("sended", "sdsdjknsd");
//     }
//   });
// });

//middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  })
);
app.use(express.json());
app.disable("x-powered-by");

let users = new Map();

//socket io connection
io.on("connection", (socket) => {
  console.log("client connected");
  const { contactNo, username } = socket.handshake.query;
  users.set(contactNo, socket.id);

  //listen to event send message
  //when a client sends a message
  socket.on("send-message", async (messageBody) => {
    const { message, recipient, date, time } = messageBody;
    const newMesage = {
      ...messageBody,
      recipient: { recipientNo: contactNo },
      sender: { contactNo: contactNo },
    };

    const newConvo = new Conversation({
      sender: contactNo,
      recipient: recipient.recipientNo,
      date,
      time,
      message,
      participants: [contactNo, recipient.recipientNo],
    });

    await newConvo.save();

    io.to(users.get(recipient.recipientNo)).emit("recieve-message", newMesage);
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
app.use("/api", conversationRoutes);
app.get("/", (req, res) => {
  res.send("App is running");
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).json({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT;

server.listen(PORT || 8000, () =>
  console.log(`server is listening on port = ${PORT}`)
);
