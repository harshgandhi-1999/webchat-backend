const Conversation = require("../../models/conversation");

module.exports = (io, socket, users) => {
  socket.on("send-message", async (messageBody) => {
    const { message, recipient, date, time } = messageBody;
    const newMesage = {
      ...messageBody,
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

    io.to(users.get(recipient.recipientNo)).emit("recieve-message", newMesage);
  });
};
