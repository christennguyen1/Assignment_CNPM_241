const isEmail = require('../middlewares/emailorusername')
require('dotenv').config();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const modelUser = require('../models/Users');


const loginService = async (email, password) => {
    const user = await modelUser.findOne({"email": email }).select('+password').lean().exec();
    if (!user) {
        return { error: 'Invalid username or password' }; // Trả về lỗi nếu không tìm thấy user
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { error: 'Invalid username or password' }; // Trả về lỗi nếu mật khẩu không đúng
    }

    const accessToken = JWT.sign({ id: user._id }, process.env.accessTokenSecret, { expiresIn: '1h' });
    const refreshToken = JWT.sign({ id: user._id }, process.env.refreshTokenSecret, { expiresIn: '7d' });

    const { password: _, ...userProfile } = user; // Không trả về mật khẩu
    return {
        userProfile,
        accessToken,
        refreshToken
    };
};


const registerService = async (data) => {
    const { email, password, mssv, faculty, fname, phone } = data; // Đảm bảo data được truyền vào hàm

    // Kiểm tra các trường bắt buộc
    if (!email || !password || !faculty || !fname || !phone) {
        return { error: 'email, password, full name, phone number, and faculty are required.' };
    }

    // Kiểm tra nếu email đã tồn tại
    const existingUser = await modelUser.findOne({ $or: [{ email }] });
    if (existingUser) {
        return { error: 'Email already exists.' };
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new modelUser({
        email,
        password: hashedPassword,
        role: 'student',
        faculty,
        full_name: fname,
        phone_number: phone,
        mssv
    });

    // Lưu vào cơ sở dữ liệu
    const result = await newUser.save();

    return { message: 'User registered successfully', data: result };
};

module.exports = { loginService, registerService };