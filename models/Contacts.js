const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    members: {
        type: Array
    },
    message: {
        type: String
    }},
    {
        timestamps: true
    }
);

const contact = mongoose.model('Contact', ContactSchema);

module.exports = contact;