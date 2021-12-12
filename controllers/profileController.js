const User = require("../models/user");

const profiler = async (profRes, profiles) => {
  for (var i = 0; i < profRes.length; i++) {
    let newProf = {
      _id: profRes[i]._id,
      name: profRes[i].name,
      email: profRes[i].email,
      uid: profRes[i].uid,
      "socket-id": profRes[i]["socket-id"],
    };
    profiles = [...profiles, newProf];
  }
  return profiles;
};

const listProfiles = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  User.findOne({ uid: reqUid, "access-token": reqAccToken })
    .then((resUser) => {
      if (resUser) {
        User.find()
          .then((profRes) => {
            let profiles = [];
            profiler(profRes, profiles).then((profilerRes) => {
              res.json({ profiles: profilerRes });
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

const listMe = (req, res) => {
  reqUid = req.headers.uid;
  reqAccToken = req.headers["access-token"];
  User.findOne({ uid: reqUid, "access-token": reqAccToken })
    .then((resUser) => {
      if (resUser) {
        let newProf = {
          _id: resUser._id,
          name: resUser.name,
          email: resUser.email,
          uid: resUser.uid,
          "socket-id": resUser["socket-id"],
        };
        res.json({ profile: newProf });
      } else {
        res.json({ msg: "user not found please authenticate" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  listProfiles,
  listMe
};