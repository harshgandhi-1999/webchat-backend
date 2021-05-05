const User = require("../models/user");

exports.addContact = async (req, res) => {
  const { contactNo, name } = req.body;
  const userId = req.params.userId;
  const newContact = {
    contactNo,
    name,
  };

  try {
    const foundUser = await User.findById(userId).select("contactList").exec();
    if (foundUser) {
      const contactAlreadyExist = await foundUser.contactList.some(
        (el) => el.contactNo === contactNo || el.name === name
      );

      if (contactAlreadyExist) {
        return res.status(403).json({
          message: "This contact already exists",
        });
      }

      await foundUser.contactList.push(newContact);
      await foundUser.save();

      res.status(200).json({
        message: "Contact Added",
      });
    } else {
      res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllContacts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const foundUser = await User.findById(userId).select("contactList").exec();
    if (foundUser) {
      res.status(200).json({
        contactList: foundUser.contactList,
      });
    } else {
      res.status(404).json({
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getChatList = async (req, res) => {
  const userId = req.params.userId;
  try {
    const foundUser = await User.findById(userId)
      .select("conversationList")
      .exec();
    if (!foundUser) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    const formattedList = await foundUser.conversationList.map((item) => {
      return {
        recipient: { recipientName: item.name, recipientNo: item.contactNo },
        messages: [],
      };
    });

    res.status(200).json({
      chatList: formattedList,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.updateChatList = async (req, res) => {
  // update name
  const userId = req.params.userId;
  const { contactNo, name } = req.body;
  try {
    const foundUser = await User.findById(userId)
      .select("conversationList")
      .exec();
    if (!foundUser) {
      return res.status(404).json({
        message: "Not Found",
      });
    }

    let updatedList = await foundUser.conversationList.map((item) => {
      if (item.contactNo === contactNo) {
        return {
          ...item._doc,
          name: name,
        };
      }
      return item;
    });
    foundUser.conversationList = updatedList;
    await foundUser.save();
    res.status(200).json({
      message: "Updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
