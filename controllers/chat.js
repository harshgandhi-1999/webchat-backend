const Chat = require("../models/chat");
const User = require("../models/user");

exports.createNewChat = async (req, res) => {
  const userId = req.auth.userId;
  const participantId = req.body.participantId;

  if (participantId === userId) {
    return res.status(400).json({
      message: "You cannot do chat with yourself",
    });
  }

  const participantExist = await User.findById(participantId);

  if (!participantExist) {
    return res.status(404).json({
      message: "Paritipant doesn't exist",
    });
  }

  const participants = [userId, participantId];

  const chatAlreadyExist = await Chat.findOne({
    type: "PRIVATE",
    participants: { $all: participants, $size: 2 },
  });

  if (chatAlreadyExist) {
    return res.status(400).json({
      message: "Chat already exist",
    });
  }

  const chat = Chat({
    createdBy: userId,
    participants,
  });

  try {
    await chat.save();
    res.status(200).json({
      message: "New chat created",
      chat,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Unable to create new chat",
    });
  }
};

exports.getChatById = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(400).json({
        message: `Chat not found with chatId: ${chatId}`,
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.createGroupChat = async (req, res) => {
  const userId = req.auth.userId;
  const { groupName, participants } = req.body;

  if (!participants.includes(userId)) {
    participants.push(userId);
  }

  // check if all ids exists in db
  const existingUsers = await User.find({ _id: { $in: participants } });

  if (existingUsers.length !== participants.length) {
    return res.status(400).json({
      message: "One or more participants does not exist.",
    });
  }

  const chat = Chat({
    type: "GROUP",
    groupName,
    createdBy: userId,
    participants,
  });

  try {
    await chat.save();
    res.status(200).json({
      message: "New chat created",
      chat,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Unable to create new chat",
    });
  }
};
