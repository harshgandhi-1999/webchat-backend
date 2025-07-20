const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");

const { addContact, getAllContacts } = require("../controllers/user");
const checkErrors = require("../middlewares/checkErrors");
const isAuthorized = require("../middlewares/isAuthorized");

router.post(
  "/contact/add/",
  [
    body("contactId").isMongoId().withMessage("Field error: Invalid contactId"),
    check("aliasName", "Field error: aliasName is required")
      .trim()
      .isLength({ min: 1 }),
  ],
  checkErrors,
  isAuthorized,
  addContact
);
router.get("/contact/", isAuthorized, getAllContacts);

module.exports = router;
