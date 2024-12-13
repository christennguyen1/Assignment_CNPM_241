const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = require("./order.js").Schema

const Users = new Schema({
    full_name: {
        type: String,
        maxLength: 255,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['student','admin'],
        default: 'student'
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    mssv: {
        type: String,
    },
    paper_credit: {
        type: String,
    },
    faculty: {
        type: String,
    },
    history: {
        type: [orderSchema]
    },
});

module.exports = mongoose.model('Users', Users, 'Users');
