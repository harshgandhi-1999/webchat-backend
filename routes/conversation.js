const router = require("express").Router();

const { getConvo, createNewConvo } = require("../controllers/conversation");
const isAuthorized = require("../middlewares/isAuthorized");

router.post("/createnew/:userId", isAuthorized, createNewConvo);

router.get("/getconvo/:userId", isAuthorized, getConvo);

module.exports = router;
