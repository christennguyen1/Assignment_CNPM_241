const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');


const usersRouter = require('./userRoutes');
const emailRoutes = require('./emailRoutes');

const endUserRoute = require('./user.route')
const adminRoute = require('./admin.route');
const UserRouter = require('./userRoutes');

router.use('/user', usersRouter);
router.use('/email', emailRoutes);
router.use('/file', emailRoutes);



module.exports = router;
