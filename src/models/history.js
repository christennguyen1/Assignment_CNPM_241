"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const orderSchema = require("./order.model.js").Schema
const historySchema = new mongoose.Schema({
    processed_date: {
        type: Date,
        required: true
    },
    process_status: {
        type: String
    },
    process_msg: {
        type: String
    },
    order: {
        type: orderSchema 
    }
});
exports.default = mongoose.model('history', historySchema);
