var express = require('express');
var EmailRoutes = express.Router();
const emailController = require('../controllers/emailController');
const emailorusername = require('../middlewares/emailorusername');

EmailRoutes.post('/send-code', emailorusername, emailController.send_code);
EmailRoutes.post('/confirm-code', emailorusername, emailController.confirm_code);

module.exports = EmailRoutes;
