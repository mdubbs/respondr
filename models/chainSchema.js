var mongoose = require("mongoose");

var chainSchema = new mongoose.Schema({
		sender: String,
		type: String,
    received: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
    messages: [mongoose.Schema.Types.Mixed]
});

module.exports = mongoose.model('chains', chainSchema);