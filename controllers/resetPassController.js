const User = require("../models/user");
const Otp = require("../models/otp");
const otpGen = require("../utils/otpGen");
const sendOtpToMail = require("./otpMailer");

const userPresentCheck = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((respUser) => {
      if (respUser) {
        res.json({ msg: "user present" });
      } else {
        res.json({ msg: "user not present" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendOtp = (req, res) => {
  const otpVal = otpGen();
  const otpDat = {
    email: req.body.email,
    otp: otpVal,
  };
  const otp = new Otp(otpDat);
  Otp.findOne({ email: req.body.email }).then((resUser) => {
    if (resUser) {
      Otp.findOneAndUpdate(
        { email: otpDat.email },
        { $set: { otp: otpDat.otp } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
          }
          sendOtpToMail(req, res, otpDat.otp);
        }
      );
    } else {
      otp
        .save()
        .then((resp) => {
          sendOtpToMail(req, res, otpDat.otp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

const validateOtp = (req, res) => {
  const otpDat = {
    email: req.body.email,
    otp: parseInt(req.body.otp),
  };
  Otp.findOne({ email: otpDat.email }).then((resUser) => {
    if (resUser) {
      if (otpDat.otp === resUser.otp) {
        console.log("otp validated success");
        res.json({ msg: "otp validated success" });
      } else {
        console.log("otp not valid");
        res.json({ msg: "otp not valid" });
      }
      console.log(resUser);
    } else {
      res.json({ msg: "user not present" });
    }
  });
};
module.exports = {
  userPresentCheck,
  sendOtp,
  validateOtp,
};
