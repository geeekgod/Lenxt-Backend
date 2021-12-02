const bcrypt = require("bcrypt");
const User = require("../models/user");
const uidGen = require("../utils/uidGen");
const genAccessToken = require("../utils/genAccessToken");

const signupController = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userDat = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      uid: uidGen(),
      "access-token": genAccessToken(15),
      "socket-id": " ",
    };
    const user = new User(userDat);

    User.find({ email: req.body.email })
      .then((user_t) => {
        if (user_t[0] !== undefined) {
          res.status(403).json({ errMsg: "User already exists" });
        } else {
          user
            .save()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: "User Created",
                token: {
                  uid: userDat.uid,
                  "access-token": userDat["access-token"],
                },
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
};

const signinController = async (req, res) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .then(async (user_t) => {
      const user = user_t[0];
      if (!user) {
        return res.status(400).json({ err: "User not found please register" });
      } else {
        try {
          if (await bcrypt.compare(req.body.password, user.password)) {
            res.set({ uid: user.uid, "access-token": user["access-token"] });
            res.json({
              message: { message: "Logged in!!" },
              token: {
                uid: user.uid,
                "access-token": user["access-token"],
              },
            });
          } else {
            res.json({ err: "Incorrect Password" });
          }
        } catch {
          res.status(500).json();
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  signupController,
  signinController,
};
