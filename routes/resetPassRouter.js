const express = require("express");
const router = express.Router();

const resetPassController = require("../controllers/resetPassController");

router.post("/", resetPassController.userPresentCheck);

router.post("/send-otp", resetPassController.sendOtp);

module.exports = router;
