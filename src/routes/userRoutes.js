var express = require('express');
var UserRouter = express.Router();
const Usercontroller = require('../controllers/userController');
const refreshToken = require('../middlewares/refreshToken');
const authenticateToken = require('../middlewares/authenticateToken');
const emailorusername = require('../middlewares/emailorusername');
const checkAdmin= require('../middlewares/checkRole').checkAdmin;
const checkUser= require('../middlewares/checkRole').checkUser

const adminRoute = require("../routes/admin.route")
const enduserRoute = require("../routes/enduser.route")

UserRouter.post('/login', Usercontroller.login);
UserRouter.post('/register', Usercontroller.register);
UserRouter.patch('/forgot-password', emailorusername, Usercontroller.forgot_password);
UserRouter.get('/logout', authenticateToken, Usercontroller.logout);
UserRouter.get('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', user: req.user });
});
UserRouter.post('/refresh-token', refreshToken);

UserRouter.use('/admin', [authenticateToken, checkAdmin], adminRoute)
router.use('/enduser', [authenticateToken, checkUser], enduserRouter)

module.exports = UserRouter;
