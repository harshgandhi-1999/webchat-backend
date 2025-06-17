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
  // const reqUrl = url.format({
  //   protocol: req.protocol,
  //   host: req.get("host"),
  //   pathname: req.originalUrl,
  // });
  const participants = req.query["participants[]"];
  // const page = parseInt(req.query.page);
  // const limit = 10;
  console.log(participants);
  try {
    if (
      participants === undefined ||
      participants === null ||
      participants.length < 2
      // page <= 0
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
      .select("sender recipient date time message createdAt")
      .sort({ createdAt: 1 }) //desc order
      // .limit(limit)
      // .skip((page - 1) * limit)
      .exec();

    res.status(200).json({
      message: "fetched",
      // previous: page <= 1 ? null : page - 1,
      // next: page >= allMessages.length ? null : page + 1,
      allMessages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
