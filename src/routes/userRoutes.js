var express = require('express');
var UserRouter = express.Router();
const Usercontroller = require('../controllers/userController');
const refreshToken = require('../middlewares/refreshToken');
const authenticateToken = require('../middlewares/authenticateToken');
const emailorusername = require('../middlewares/emailorusername');


UserRouter.post('/login', Usercontroller.loginController);
UserRouter.post('/register', Usercontroller.registerController);
UserRouter.patch('/forgot-password', emailorusername, Usercontroller.forgot_password);
UserRouter.get('/logout', authenticateToken, Usercontroller.logout);
UserRouter.get('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});
UserRouter.post('/refresh-token', refreshToken);
UserRouter.post('/addBankAccount', Usercontroller.AddBankAccountController);
UserRouter.post('/addBankAccount', Usercontroller.AddBankAccountController);

module.exports = UserRouter;
