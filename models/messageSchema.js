var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    received: { type: Date, default: Date.now },
    messageType: String,
    content: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('messages', messageSchema);