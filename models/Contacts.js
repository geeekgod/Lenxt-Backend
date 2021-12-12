const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const contact = mongoose.model("Contact", ContactSchema);

module.exports = contact;
