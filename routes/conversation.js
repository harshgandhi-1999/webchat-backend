const express = require("express");
const router = express.Router();

const { createConvo, getConvo } = require("../controllers/conversation");

router.post("/createconvo", createConvo);

router.get("/getConvo", getConvo);

module.exports = router;
