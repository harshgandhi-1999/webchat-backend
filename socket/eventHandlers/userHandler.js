const Conversation = require("../../models/conversation");
const { encryptData, decryptData } = require("../../e2e/aes");

module.exports = (io, socket, users, contactNo) => {
  socket.on("send-message", async (messageBody) => {
    let decryptedData = decryptData(messageBody);
    const { message, recipient, date, time } = decryptedData;
    const newMessage = {
      ...decryptedData,
      recipient: { recipientNo: contactNo },
      sender: { contactNo: contactNo },
    };

    const newConvo = new Conversation({
      sender: contactNo,
      recipient: recipient.recipientNo,
      date,
      time,
      message,
      participants: [contactNo, recipient.recipientNo],
    });

    await newConvo.save();

    let encryptedData = encryptData(newMessage);

    io.to(users.get(recipient.recipientNo)).emit(
      "recieve-message",
      encryptedData
    );
  });
};
