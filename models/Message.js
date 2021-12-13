const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
    messages: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const message = mongoose.model("Message", MessageSchema);

module.exports = message;
