const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

//import from controllers
const { login, signup } = require("../controllers/auth");
const checkErrors = require("../middlewares/checkErrors");
const checkUserAlreadyExist = require("../middlewares/checkUserAlreadyExist");

router.post(
  "/login",
  [
    check("contact", "Contact no. should be of 10 digits").matches(
      /^[6-9][0-9]{9}/,
      "i"
    ),
    check("password", "Password should be atleaast 1 character")
      .trim()
      .isLength({
        min: 1,
      }),
  ],
  checkErrors,
  login
);

router.post(
  "/signup",
  [
    check("username", "username is required").trim().isLength({ min: 1 }),
    check("contact", "Contact no. should be of 10 digits").matches(
      /^[6-9][0-9]{9}/,
      "i"
    ),
    check("password", "Password should be atleast 1 character")
      .trim()
      .isLength({
        min: 1,
      }),
  ],
  checkErrors,
  checkUserAlreadyExist,
  signup
);

module.exports = router;
