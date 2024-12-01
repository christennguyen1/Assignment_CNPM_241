"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    mssv:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
    },
    isResolved:{
        type: Boolean,
        default: false
    }
});
exports.default = mongoose.model('report', reportSchema);
