const User = require("../models/user");
const Message = require("../models/Message");

const listMessages = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  User.findOne({ uid: reqUid, "access-token": reqAccToken })
    .then((resUser) => {
      if (resUser) {
        Message.find({ members: resUser._id })
          .then((resMessages) => {
            if (resMessages) {
              res.json({ messages: resMessages });
            } else {
              res.json({ msg: "messages not found" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.json({ msg: "user not found please authenticate" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  listMessages,
};
