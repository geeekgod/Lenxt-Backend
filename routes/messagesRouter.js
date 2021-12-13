const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

router.get("/", messageController.listMessages);

module.exports = router;
