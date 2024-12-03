"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    created_date: {
        type: Date,
        required: true
    },
    name_file: {
        type: String,
        required: true
    },
    num_page: {
        type: String,
        required: true
    },
    face_page:{
        type: Number,
        required: true
    },
    color_print:{
        type: Number,
        required: true,
        enum: ['yes','no'],
        default: 'no'
    },
    status_proposal:{
        type: Number,
        required: true
    },
    printer_id:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'printer',
        required: true
    },
    user_email:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    }
});
exports.default = mongoose.model('order', orderSchema);
