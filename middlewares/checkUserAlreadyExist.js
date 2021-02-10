const User = require("../models/user");

const checkUserAlreadyExist = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { contact: req.body.contact }],
    })
      .select("username contact")
      .exec();
    if (user) {
      return res.status(422).json({
        message: "User already exist",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = checkUserAlreadyExist;
