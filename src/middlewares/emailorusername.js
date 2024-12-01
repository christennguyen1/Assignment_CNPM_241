const isEmail = (str) => {
    if (!str) return false; // Kiểm tra nếu str là chuỗi rỗng
    const emailRegex = /^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/;
    return emailRegex.test(str);
};

module.exports =  isEmail ;