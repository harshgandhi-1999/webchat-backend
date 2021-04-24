const Conversation = require("../models/conversation");
const User = require("../models/user");

exports.createNewConvo = async (req, res) => {
  const userId = req.params.userId;
  const { contactNo, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { conversationList: { contactNo: contactNo, name: name } },
      },
      { upsert: true, new: true }
    ).select("conversationList");

    res.status(200).json({
      user: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getConvo = async (req, res) => {
  const participants = req.query.participants;
  try {
    if (
      participants === undefined ||
      participants === null ||
      participants.length < 2
    ) {
      return res.status(400).json({
        message: "Invalid query",
      });
    }

    //fetching all messages with users in array participants
    const allMessages = await Conversation.find({
      $and: [
        { participants: { $all: participants } },
        { participants: { $size: participants.length } },
      ],
    })
      .select("sender recipient date time message")
      .sort({ updatedAt: 1 }) //asc order
      .exec();

    res.status(200).json({
      message: "fetched",
      allMessages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
