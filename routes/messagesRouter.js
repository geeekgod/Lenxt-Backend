const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.get("/", messageController.listMessages);

router.post("/addMessage", messageController.addMessage);

module.exports = router;
