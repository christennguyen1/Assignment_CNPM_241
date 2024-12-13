const modelUser = require('../models/Users');

const checkRole = async (req, res, next) => {
    const userId = req.user.id;
    const user = await modelUser.findById(userId).exec();;
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    req.role = user.role;
    req.email = user.email;
    next();
}

const checkAdmin = async (req, res, next) => {
    const id = req.user.id;
    const user = await modelUser.findById(id).exec();;
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (user.role == 'admin') {
        req.email = user.email;
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Admins only.' });
}

const checkUser = async (req, res, next) => {
    const id = req.user.id;
    const user = await modelUser.findById(id).exec();;
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    if (user.role != 'admin') {
        req.email = user.email;
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Enduser only.' });
}

module.exports ={
    checkRole, 
    checkAdmin,
    checkUser
} 