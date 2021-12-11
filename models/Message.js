const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    messages: [
      {
        id: Number,
        name: String,
        message: String,
        time: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const message = mongoose.model("Message", MessageSchema);

module.exports = message;