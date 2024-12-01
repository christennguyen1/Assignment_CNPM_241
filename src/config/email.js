require('dotenv').config();
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_MAIL,
        pass: process.env.EMAIL_KEY,
    },
});
module.exports = transporter;
