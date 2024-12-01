"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    created_date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    nb_papers:{
        type: Number,
        required: true
    },
    face:{
        type: Number,
        required: true
    },
    printer:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'printer',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    }
});
exports.default = mongoose.model('order', orderSchema);
