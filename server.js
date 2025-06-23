require("dotenv").config();
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./database/dbConnection");
const cacheClient = require("./cache/cacheClient");
const initializeSocket = require("./socket");

//creating instance of express
const app = express();
const server = http.createServer(app);

//IMPORT ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

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

//ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);
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

async function startServer() {
  try {
    // 1. Connect to Redis
    await cacheClient.connect();
    console.log("✅ Redis connected");

    // 2. Connect to DB
    await connectDB();
    console.log("✅ DB connected");

    initializeSocket(server);
    console.log("✅ WEBSOCKET INITIALIZED");

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1); // Optional: Exit with failure
  }
}

startServer();
