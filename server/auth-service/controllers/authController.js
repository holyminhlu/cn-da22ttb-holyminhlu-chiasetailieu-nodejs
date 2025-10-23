const CreateAccount = require('../models/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.CreateAccount = async (req, res) => {
    try {
        const { fullName, email, passWord } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const existing = await CreateAccount.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        // Băm password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passWord, salt);

        // Sinh token xác thực chứa thông tin user
        const token = jwt.sign(
            { fullName, email, passWord: hashedPassword },
            'your_secret_key',
            { expiresIn: '1d' }
        );

        // Gửi email xác thực
        const verifyUrl = `http://localhost:3000/api/auth/verify?token=${token}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cheaptriptravelsp@gmail.com',
                pass: 'qwnizhwwxasikeri'
            }
        });

        await transporter.sendMail({
            from: '"CheapTrip" <cheaptriptravelsp@gmail.com>',
            to: email,
            subject: 'Xác thực tài khoản CheapTrip',
            html: `<p>Nhấn vào nút bên dưới để xác thực tài khoản:</p>
                   <a href="${verifyUrl}" style="padding:10px 20px;background:#FF6200;color:#fff;text-decoration:none;border-radius:5px;">Xác nhận tài khoản</a>`
        });

        res.status(201).json({ message: 'Vui lòng kiểm tra email để xác nhận tài khoản!' });
    } catch (error) {
        console.log('Lỗi tạo tài khoản: ', error);
        res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
};

exports.checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ exists: false, message: 'Thiếu email để kiểm tra' });
        }

        const user = await CreateAccount.findOne({ email });

        if (user) {
            return res.status(200).json({ exists: true, message: 'Email đã tồn tại' });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Lỗi kiểm tra email:', error);
        return res.status(500).json({ exists: false, message: 'Lỗi máy chủ khi kiểm tra email' });
    }
};


exports.LoginAccount = async (req, res) => {
    try {
        const { email, passWord } = req.body;
        // Tìm user theo email
        const user = await CreateAccount.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }
        // So sánh mật khẩu (nếu đã hash)
        const isMatch = await bcrypt.compare(passWord, user.passWord);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }
        // Đăng nhập thành công
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Đã có lỗi xảy ra khi đăng nhập' });
    }
}

exports.getCustomerByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const user = await CreateAccount.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            gender: user.gender || ''
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateCustomerInfo = async (req, res) => {
    try {
        const { email, phone, address, gender } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const user = await CreateAccount.findOneAndUpdate(
            { email },
            { phone, address, gender },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Cập nhật thông tin thành công', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        const { fullName, email, passWord } = decoded;

        // Kiểm tra email đã tồn tại chưa
        const existing = await CreateAccount.findOne({ email });
        if (existing) {
            return res.send('Email đã được đăng ký!');
        }

        // Lưu user vào DB
        const newAccount = new CreateAccount({ fullName, email, passWord });
        await newAccount.save();

        res.send('Đăng ký thành công! Bạn có thể đăng nhập.');
    } catch (err) {
        res.status(400).send('Token không hợp lệ hoặc đã hết hạn.');
    }
};