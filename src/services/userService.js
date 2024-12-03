const isEmail = require('../middlewares/emailorusername')
require('dotenv').config();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const modelUser = require('../models/Users');


const loginService = async (email, password) => {
    const user = await modelUser.findOne({ email }).select('+password').lean().exec();
    if (!user) {
        return { error: 'Invalid username or password' }; // Trả về lỗi nếu không tìm thấy user
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { error: 'Invalid username or password' }; // Trả về lỗi nếu mật khẩu không đúng
    }

    const accessToken = JWT.sign({ id: user._id }, process.env.accessTokenSecret, { expiresIn: '1h' });
    const refreshToken = JWT.sign({ id: user._id }, process.env.refreshTokenSecret, { expiresIn: '7d' });

    await modelUser.updateOne({ _id: user._id }, { refreshToken });

    const { password: _, ...userProfile } = user; // Không trả về mật khẩu
    return {
        userProfile,
        accessToken,
        refreshToken
    };
};


const registerService = async (data) => {
    // const { email, password, faculty, fname, phone } = data; // Đảm bảo data được truyền vào hàm

    // Kiểm tra các trường bắt buộc
    console.log(data.role);

    let email = data.email;
    
    if (data.role == 'student'){
        if (!data.email || !data.password || !data.faculty || !data.fname || !data.phone || !data.mssv) {
            return { error: 'mssv, email, password, full name, phone number, bank_account and faculty are required.' };
        }

        let mssv = data.mssv;

        const existingUserMSSV = await modelUser.findOne({ $or: [{ mssv }] });
        if (existingUserMSSV) {
            return { error: 'Email already exists.' };
        }
    }

    else if (data.role == 'admin'){
        if (!data.email || !data.password || !data.faculty || !data.fname || !data.phone) {
            return { error: 'email, password, full name, phone number, bank_account and faculty are required.' };
        }
    }

    // Kiểm tra email có phải là email hợp lệ của trường đại học không
    if (!isEmail(data.email)) {
        return { error: 'Email is not belong to university' };
    }

    // Kiểm tra nếu email đã tồn tại
    const existingUserEmail = await modelUser.findOne({ $or: [{ email }] });
    if (existingUserEmail) {
        return { error: 'Email already exists.' };
    }


    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(data.password, 10);

    let newUser = {
        email: data.email,
        password: hashedPassword,
        role: data.role,
        faculty: data.faculty,
        full_name: data.fname,
        phone_number: data.phone
    };
    
    if (data.role === 'student') {
        newUser.mssv = data.mssv; 
    }
    

    const userInstance = new modelUser(newUser);

    const result = await userInstance.save();

    return { message: 'User registered successfully', data: result };
};


const AddBankAccountService = async (data) => {
    // const { email, password, faculty, fname, phone } = data; // Đảm bảo data được truyền vào hàm

    const { email, bank_account } = data;
    
    if (!email || !bank_account) {
        return { error: 'email, bank account are required.' };
    }

    // Kiểm tra nếu email đã tồn tại
    const existingUserEmail = await modelUser.findOne({ $or: [{ email }] });
    if (!existingUserEmail) {
        return { error: 'Email was not register.' };
    }

    existingUserEmail.bank_account = bank_account;
    const result = await existingUserEmail.save(); // Lưu lại thông tin sau khi cập nhật
    
    return { message: 'User registered successfully', data: result };
};

module.exports = { loginService, registerService, AddBankAccountService };