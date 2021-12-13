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

const addMessage = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  reqMsgData = req.body.msgData;
  User.findOne({ uid: reqUid, "access-token": reqAccToken })
    .then((resUser) => {
      if (resUser) {
        Message.findOne({ members: [resUser._id, reqMsgData.id] }).then(
          (respMsg) => {
            if (respMsg) {
              respMsg.messages.push(reqMsgData);
              let newMsg = respMsg.messages;
              Message.findOneAndUpdate(
                { members: [resUser._id, reqMsgData.id] },
                { $set: { messages: newMsg } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    res.json({ msg: "somenthing went wrong" });
                  }
                  console.log(doc);
                  res.json({ msg: "message added" });
                }
              ).catch((err) => {
                console.log(err);
              });
            }
          }
        );
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
  addMessage,
};
