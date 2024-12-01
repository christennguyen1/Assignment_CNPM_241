const { loginService, registerService } = require('../services/userService');
const bcrypt = require('bcrypt');
//Model
const modelUser = require('../models/Users');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loginService(email, password);

        // Nếu có lỗi trong loginService (ví dụ lỗi xác thực), trả lỗi
        if (data.error) {
            return res.status(401).json({ error: data.error });
        }

        // Nếu login thành công, trả dữ liệu về client
        return res.status(200).json({
            message: 'Login successful',
            data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};


const register = async (req, res) => {
    try {
        const data = req.body;
        const result = await registerService(data);

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(200).json({
            message: result.message,
            data: result.data
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({
            message: 'Error registering user. Please try again later.',
        });
    }
};


const logout = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await modelUser.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.refreshToken = '';
        await user.save();
        return res.status(200).json({
            message: 'Logout successfully',
        });

    } catch (error) {
        return res.status(500).json({
            error: 'Server error',
        });
    }
}

const get_profile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await modelUser.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userProfile = user.toObject();
        delete userProfile.password;
        return res.status(200).json({
            message: 'Profile retrieved successfully',
            data: userProfile,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: 'Server error',
        });
    }
}

const edit_profile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await modelUser.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { username, fullname, email, newpassword, phone_number, AIO_USERNAME, AIO_KEY, webServerIp, currentpassword } = req.body;

        if (!username && !fullname && !email && !newpassword && !phone_number && !AIO_USERNAME && !AIO_KEY && !webServerIp) {
            return res.status(400).json({ error: 'No data provided to update.' });
        }

        if (!currentpassword) {
            return res.status(400).json({
                error: 'Current password  are required.',
            });
        }

        if (newpassword && newpassword.length < 8) {
            return res.status(400).json({
                error: 'New password must be at least 8 characters long.',
            });
        }

        const isPasswordValid = await bcrypt.compare(currentpassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid current password.',
            });
        }

        if (username !== undefined) user.username = username;
        if (fullname !== undefined) user.fullname = fullname;
        if (email !== undefined) user.email = email;
        if (phone_number !== undefined) user.phone_number = phone_number;
        if (AIO_USERNAME !== undefined) user.AIO_USERNAME = AIO_USERNAME;
        if (AIO_KEY !== undefined) user.AIO_KEY = AIO_KEY;
        if (webServerIp !== undefined) user.webServerIp = webServerIp;

        if (newpassword) {
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            user.password = hashedPassword;
        }
        if (req.files) {
            if (req.files['avatar']) {
                user.avatar = {
                    data: req.files['avatar'][0].buffer,
                    contentType: req.files['avatar'][0].mimetype
                };
            }
            if (req.files['coverPhoto']) {
                user.coverPhoto = {
                    data: req.files['coverPhoto'][0].buffer,
                    contentType: req.files['coverPhoto'][0].mimetype
                };
            }
        }
        if (!AIO_USERNAME && !AIO_KEY) {
            await user.save();
            const userProfile = user.toObject();
            delete userProfile.password;
            return res.status(200).json({
                message: 'Profile updated successfully',
                data: userProfile,
            });
        }
        req.case = 'edit_profile';
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};


const change_password = async (req, res) => {
    try {
        const { password, newpassword } = req.body;
        const userId = req.user.id;
        const user = await modelUser.findById(userId).exec();
        if (!password || !newpassword) {
            return res.status(400).json({
                error: 'Current password and new password are required.',
            });
        }

        if (!user) {
            return res.status(404).json({
                error: 'User not found.',
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid current password.',
            });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: 'Password changed successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Server error',
        });
    }
}

const forgot_password = async (req, res) => {
    try {
        const { email } = req;
        const { newPassword } = req.body;
        const user = await modelUser.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: 'User not found.',
            });
        }
        if (newPassword && newPassword.length < 8) {
            return res.status(400).json({
                error: 'New password must be at least 8 characters long.',
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({
            message: 'Password changed successfully.',
        });

    }
    catch (error) {
        return res.status(500).json({
            error: 'Server error',
        });
    }
}


module.exports = { login, register, logout, get_profile, edit_profile, change_password, forgot_password };
