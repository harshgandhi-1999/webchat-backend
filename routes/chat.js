const router = require("express").Router();
const { body, param } = require("express-validator");

const {
  createNewChat,
  getChatById,
  createGroupChat,
  getChatList,
} = require("../controllers/chat");
const isAuthorized = require("../middlewares/isAuthorized");
const checkErrors = require("../middlewares/checkErrors");

router.post(
  "/create/",
  [
    body("participantId")
      .isMongoId()
      .withMessage("Field error: Invalid participantId"),
  ],
  checkErrors,
  isAuthorized,
  createNewChat
);

router.get(
  "/info/:chatId",
  [
    param("chatId")
      .isMongoId()
      .withMessage("Field error: Invalid participantId"),
  ],
  checkErrors,
  isAuthorized,
  getChatById
);

router.post(
  "/create/group",
  [
    body("groupName", "Required field: groupName").trim().isLength({ min: 1 }),
    body("participants", "Required field: participants").isArray({ min: 1 }),
    body("participants.*") // This applies to each item in the array
      .isMongoId()
      .withMessage("Field error: Invalid participant id in participants"),
  ],
  checkErrors,
  isAuthorized,
  createGroupChat
);

router.get("/all", isAuthorized, getChatList);

module.exports = router;
