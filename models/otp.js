const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", usersSchema);

module.exports = Otp;
