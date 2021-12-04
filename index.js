const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Models, Routes & Controllers
// const User = require("./models/users");

const authRouter = require("./routes/authRouter");
const resetPassRouter = require("./routes/resetPassRouter");

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
    // listen for requests
    console.log("connected to db", res);
    app.listen(port, () => {
      console.log("\nServer is live on http://localhost:4500");
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
