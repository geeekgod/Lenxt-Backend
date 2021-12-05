const User = require("../models/user");
const Otp = require("../models/otp");
const otpGen = require("../utils/otpGen");
const sendOtpToMail = require("./otpMailer");
const bcrypt = require("bcrypt");

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
        res.json({ msg: "otp validated success" });
      } else {
        res.json({ msg: "otp not valid" });
      }
      console.log(resUser);
    } else {
      res.json({ msg: "otp not present" });
    }
  });
};

const resetPass = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = parseInt(req.body.otp);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    User.findOne({ email: email }).then((userRes) => {
      if (userRes) {
        Otp.findOne({ email: email }).then((resUser) => {
          if (resUser) {
            if (otp === resUser.otp) {
              User.findOneAndUpdate(
                { email: email },
                { $set: { password: hashedPassword } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    res.json({ msg: "somenthing went wrong" });
                  }
                  res.json({ msg: "password reset successfull" });
                  Otp.deleteOne({ email: email }, (err) => {
                    console.log(err);
                  });
                }
              );
            } else {
              res.json({ msg: "otp not valid" });
            }
            console.log(resUser);
          } else {
            res.json({ msg: "otp not present" });
          }
        });
      } else {
        res.json({ msg: "user not found" });
      }
    });
  } catch (err) {
    res.json({ err: "err" }).status(500);
    console.log(err);
  }
};
module.exports = {
  userPresentCheck,
  sendOtp,
  validateOtp,
  resetPass,
};
