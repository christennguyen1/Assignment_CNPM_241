"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const order = require("./order.js").Schema

const historySchema = new mongoose.Schema({
    last_updated: {
        type: Date,
        required: true
    },
    process_status: {
        type: String
    },
    process_msg: {
        type: String
    },
    order:{
        type: order
    }
});
exports.default = mongoose.model('history', historySchema);
