const User = require("../models/user");

exports.addContact = async (req, res) => {
  const { contactId, aliasName } = req.body;

  const userId = req.auth.userId;

  try {
    const contactToAdd = await User.findById(contactId);
    if (!contactToAdd) {
      return res.status(404).json({
        message: "This contact doesn't exists",
      });
    }

    const foundUser = await User.findById(userId).select("contactList").exec();
    if (foundUser) {
      const contactAlreadyExistInThisUser = foundUser.contactList.some(
        (contact) => contact.contactId.equals(contactToAdd._id)
      );

      if (contactAlreadyExistInThisUser) {
        return res.status(400).json({
          message: "This user already there in your contacts",
        });
      }

      foundUser.contactList.push({ contactId, aliasName });
      await foundUser.save();

      res.status(200).json({
        message: "Contact Added",
        contactList: foundUser.contactList,
      });
    } else {
      res.status(404).json({
        message: `User Not Found with user id: ${userId}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getAllContacts = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const foundUser = await User.findById(userId).select("contactList").exec();
    if (foundUser) {
      res.status(200).json({
        contactList: foundUser.contactList,
      });
    } else {
      res.status(404).json({
        message: `User Not Found with user id: ${userId}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//TODO: Remove or update this below function
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
