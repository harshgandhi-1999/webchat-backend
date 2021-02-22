const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { addContact, getAllContacts } = require("../controllers/user");
const checkErrors = require("../middlewares/checkErrors");
const isAuthorized = require("../middlewares/isAuthorized");

router.post(
  "/addContact/:userId",
  [
    check("contactNo", "Contact no. should be of 10 digits").matches(
      /^[6-9][0-9]{9}/,
      "i"
    ),
    check("name", "Name is required").trim().isLength({ min: 1 }),
  ],
  checkErrors,
  isAuthorized,
  addContact
);
router.get("/allContacts/:userId", isAuthorized, getAllContacts);

module.exports = router;
