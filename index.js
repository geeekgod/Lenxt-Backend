const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Models, Routes & Controllers
const authRouter = require("./routes/authRouter");
const resetPassRouter = require("./routes/resetPassRouter");
const contactRouter = require("./routes/contactRouter");
const profileRouter = require("./routes/profileRouter");
const messagesRouter = require("./routes/messagesRouter");
const User = require("./models/user");
const Message = require("./models/Message");

// Config Dot env to access env's
dotenv.config();

// Mongo DB uri
const dbURI = `mongodb+srv://${process.env.APP_DB_USERNAME}:${process.env.APP_DB_PASSWORD}@cluster0.yx8a6.mongodb.net/${process.env.APP_DB_NAME}?retryWrites=true&w=majority`;

const app = express();

const port = process.env.PORT || 4500;

// App start
mongoose
  .connect(dbURI)
  .then((res) => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      socket.on("updateUser", (userId, accessToken) => {
        User.findOne({ uid: userId, "access-token": accessToken }).then(
          (uRes) => {
            if (uRes) {
              User.findOneAndUpdate(
                { uid: userId },
                { $set: { "socket-id": socket.id } },
                { new: true },
                (err, doc) => {
                  if (err) {
                    socket.emit(
                      "updateUserMsg",
                      `There was some Error while updating: ${userId}`
                    );
                  } else {
                    socket.emit(
                      "updateUserMsg",
                      `Successfully updated socket id: ${userId}`
                    );
                  }
                }
              );
            } else {
              socket.emit(
                "updateUserMsg",
                `No user found please login: ${userId}`
              );
            }
          }
        );
      });

      socket.on("send_message", (data) => {
        reqUid = data.headers.uid;
        reqAccToken = data.headers["access-token"];
        reqMsgData = data.body.msgData;
        clientMail = data.body.clientMail;
        User.findOne({ uid: reqUid, "access-token": reqAccToken })
          .then((resUser) => {
            if (resUser) {
              Message.findOne({
                members: { $all: [resUser.email, clientMail] },
              }).then((respMsg) => {
                if (respMsg) {
                  User.findOne({ email: clientMail }).then((clientUser) => {
                    if (clientUser) {
                      if (clientUser["socket-id"] !== " ") {
                        socket
                          .to(clientUser["socket-id"])
                          .emit("receive_message", { data: reqMsgData });
                      }
                      socket.emit("message_sent", {
                        msg: "message added",
                        data: { data: reqMsgData, clientMail: clientMail },
                      });
                    } else {
                      socket
                        .to(resUser["socket-id"])
                        .emit("message_sent", { msg: "message not added" });
                    }
                  });
                } else {
                  socket
                    .to(resUser["socket-id"])
                    .emit("message_sent", { msg: "message not added" });
                }
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });

      socket.on("addContact", (data) => {
        reqUid = data.headers.uid;
        reqAccToken = data.headers["access-token"];
        clientMail = data.body.clientMail;
        User.findOne({ uid: reqUid, "access-token": reqAccToken })
          .then((resUser) => {
            if (resUser) {
              User.findOne({ email: clientMail })
                .then((clientUser) => {
                  if (clientUser) {
                    if (clientUser["socket-id"] !== " ") {
                      socket
                        .to(clientUser["socket-id"])
                        .emit("receive_contacts", { msg: "load_contacts" });
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });

      socket.on("disconnect", () => {
        User.findOneAndUpdate(
          { "socket-id": socket.id },
          { $set: { "socket-id": " " } },
          { new: true },
          (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              socket.emit(
                "updateUserMsg",
                `Successfully updated socket id: ${socket.id}`
              );
            }
          }
        );
      });
    });

    server.listen(port, () => {
      console.log(`server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello From Lenxt Api" });
});

// auth Routes
app.use("/auth", authRouter);
app.use("/reset-pass", resetPassRouter);
app.use("/contacts", contactRouter);
app.use("/profiles", profileRouter);
app.use("/messages", messagesRouter);

app.get("/test", (req, res) => {
  res.json({ message: "Hello!!!!!" });
});
