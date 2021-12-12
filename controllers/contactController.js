const User = require("../models/user");
const Contact = require("../models/Contacts");

const listContacts = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  User.findOne({ uid: reqUid, "access-token": reqAccToken }).then((resUser) => {
    if (resUser) {
      Contact.find({ members: reqUid })
        .then((resContacts) => {
          console.log(resContacts);
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

module.exports = { listContacts };