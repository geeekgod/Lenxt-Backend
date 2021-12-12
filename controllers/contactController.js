const User = require("../models/user");
const Contact = require("../models/Contacts");

const contactShredder = async (resContacts, newResContacts) => {
  for (var i = 0; i < resContacts.length; i++) {
    let newContact = {
      _id: resContacts[i]._id,
      members: resContacts[i].members,
    };
    newResContacts = [...newResContacts, newContact];
  }
  return newResContacts;
};

const listContacts = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  User.findOne({ uid: reqUid, "access-token": reqAccToken })
    .then((resUser) => {
      if (resUser) {
        Contact.find({ members: resUser._id })
          .then((resContacts) => {
            let newResContacts = [];
            contactShredder(resContacts, newResContacts)
              .then((finalContacts) => {
                res.json({ contacts: finalContacts });
              })
              .catch((err) => {
                console.log(err);
              });
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

const addToContacts = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  reqClientMail = req.body.email;
  User.findOne({ uid: reqUid, "access-token": reqAccToken })
    .then((resUser) => {
      if (resUser) {
        User.findOne({ email: reqClientMail }).then((resClient) => {
          if (resClient) {
            Contact.findOne({
              members: [resUser._id, resClient._id],
            }).then((resExContact) => {
              if (resExContact) {
                res.json({ msg: "contact already present" });
              } else {
                Contact.create({ members: [resUser._id, resClient._id] })
                  .then((resContacts) => {
                    if (resContacts) {
                      res.json({ msg: "contact created" });
                    }
                  })
                  .catch((err) => console.log(err));
              }
            });
          } else {
            res.json({ msg: "client not found" });
          }
        });
      } else {
        res.json({ msg: "user not found please authenticate" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { listContacts, addToContacts };