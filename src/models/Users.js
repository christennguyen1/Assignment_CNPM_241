const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    },
    mssv: {
        type: String,
        unique: true,
    },
    bank_account: {
        type: String
    },
    number_account: {
        type: Number
    },
    number_page: {
        type: Number
    },
    faculty: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
});

module.exports = mongoose.model('Users', Users, 'Users');
