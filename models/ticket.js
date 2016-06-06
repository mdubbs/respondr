var mongoose = require("mongoose");

var ticket = new mongoose.Schema({
		sender: String,
		type: String,
		status: String,
		assigned: String,
    received: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
    messages: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('tickets', ticket);