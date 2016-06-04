var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
    received: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
    isProblem: { type: Boolean, default: false },
    content: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('messages', messageSchema);