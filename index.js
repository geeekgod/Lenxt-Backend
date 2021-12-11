const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Models, Routes & Controllers
const authRouter = require("./routes/authRouter");
const resetPassRouter = require("./routes/resetPassRouter");
const User = require("./models/user");

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
      console.log(socket.id);

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

      socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
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

app.get("/test", (req, res) => {
  res.json({ message: "Hello!!!!!" });
});