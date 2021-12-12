const User = require("../models/user");
const Contact = require("../models/Contacts");

const listContacts = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  User.findOne({ uid: reqUid, "access-token": reqAccToken }).then((resUser) => {
    if (resUser) {
      Contact.find({ members: parseInt(reqUid) })
        .then((resContacts) => {
          res.json({ contacts: resContacts });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.json({ msg: "user not found" });
    }
  });
};

const addToContacts = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  reqClientMail = req.body.email;
  User.findOne({ uid: reqUid, "access-token": reqAccToken }).then((resUser) => {
    if (resUser) {
      User.findOne({ email: reqClientMail }).then((resClient) => {
        if (resClient) {
          Contact.findOne({ members: [parseInt(reqUid), resClient.uid] }).then(
            (resExContact) => {
              if (resExContact) {
                res.json({ msg: "contact already present" });
              } else {
                Contact.create({ members: [parseInt(reqUid), resClient.uid] })
                  .then((resContacts) => {
                    if (resContacts) {
                      res.json({ msg: "contact created" });
                    }
                  })
                  .catch((err) => console.log(err));
              }
            }
          );
        } else {
          res.json({ msg: "client not found" });
        }
      });
    } else {
      res.json({ msg: "user not found please authenticate" });
    }
  });
};

module.exports = { listContacts, addToContacts };
