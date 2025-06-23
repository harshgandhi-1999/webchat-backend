const Chat = require("../models/chat");

exports.createNewChat = async (req, res) => {
  const userId = req.auth.userId;
  const participantId = req.body.participantId;

  const chat = Chat({
    createdBy: userId,
    participants: [userId, participantId],
  });

  try {
    await chat.save();
    res.status(200).json({
      message: "New chat created",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Unable to create new chat",
    });
  }

  //   const { contactNo, name } = req.body;
  //   try {
  //     const user = await User.findByIdAndUpdate(
  //       userId,
  //       {
  //         $push: { conversationList: { contactNo: contactNo, name: name } },
  //       },
  //       { upsert: true, new: true }
  //     ).select("conversationList");

  //     res.status(200).json({
  //       user: user,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({
  //       message: "Internal server error",
  //     });
  //   }
};

exports.getChatById = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      console.log(err);
      res.status(400).json({
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
