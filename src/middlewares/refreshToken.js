const JWT = require('jsonwebtoken');
const modelUser = require('../models/Users');
const accessTokenSecret = process.env.accessTokenSecret;
const refreshTokenSecret = process.env.refreshTokenSecret;

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({
        status: 401,
    });

    JWT.verify(refreshToken, refreshTokenSecret, async (err, user) => {
        if (err) return res.status(403).json({
            error: 'Invalid refresh token'
        });

        const dbUser = await modelUser.findById(user.id);
        if (!dbUser || dbUser.refreshToken !== refreshToken) return res.status(403).json({
            error: 'Invalid refresh token',
        });

        const newAccessToken = JWT.sign({ id: dbUser._id }, accessTokenSecret, { expiresIn: '1h' });
        return res.status(200).res.json({ accessToken: newAccessToken });
    });
};

module.exports = refreshToken;
