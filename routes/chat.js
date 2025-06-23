const router = require("express").Router();

const { createNewChat, getChatById } = require("../controllers/chat");
const isAuthorized = require("../middlewares/isAuthorized");

router.post("/create/", isAuthorized, createNewChat);

router.get("/:chatId", isAuthorized, getChatById);

module.exports = router;
