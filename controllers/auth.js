const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const options = {
  algorithm: "HS256",
  expiresIn: "1d",
};
exports.login = async (req, res) => {
  const { contact, password } = req.body;
  try {
    const foundUser = await User.findOne({ contact: contact }).exec();
    if (foundUser) {
      const payload = { contact: foundUser.contact };
      const result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, options);
        res.status(200).json({
          userInfo: {
            userId: foundUser._id,
            username: foundUser.username,
            contactNo: foundUser.contact,
          },
          token: accessToken,
          message: "Login successfull",
        });
      } else {
        res.status(401).json({
          message: "Incorrect contact no. or password",
        });
      }
    } else {
      res.status(404).json({
        message: "Incorrect contact no. or password",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.signup = async (req, res) => {
  const { username, password, contact } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User({
      username,
      contact,
      password: hashedPassword,
    });
    // save into database
    await user.save();
    res.status(200).json({
      message: "Signup Successfull",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
