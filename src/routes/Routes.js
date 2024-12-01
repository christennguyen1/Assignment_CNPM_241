const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const checkRole = require('../middlewares/checkRole');

const usersRouter = require('./userRoutes');
const emailRoutes = require('./emailRoutes');

router.use('/user', usersRouter);
router.use('/email', emailRoutes);
router.use('/file', emailRoutes);

module.exports = router;
