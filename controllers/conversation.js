const Conversation = require("../models/conversation");

exports.createConvo = async (req, res) => {
  const { sender, recipient, message } = req.body;
  const newConvo = new Conversation({
    sender,
    recipient,
    message,
  });

  try {
    await newConvo.save();
    res.status(200).json({
      message: "OK",
      convo: newConvo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getConvo = async (req, res) => {
  const { sender, recipient } = req.body;
  try {
    const allMessages = await Conversation.find({
      $or: [
        { sender: sender, recipient: recipient },
        { sender: recipient, recipient: sender },
      ],
    }).exec();

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
