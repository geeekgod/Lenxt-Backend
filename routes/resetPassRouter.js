const express = require("express");
const router = express.Router();

const resetPassController = require("../controllers/resetPassController");

router.post("/", resetPassController.userPresentCheck);

router.post("/send-otp", resetPassController.sendOtp);

router.post("/validate-otp", resetPassController.validateOtp);


module.exports = router;
