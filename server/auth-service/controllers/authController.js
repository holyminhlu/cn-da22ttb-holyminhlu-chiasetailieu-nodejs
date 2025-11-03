const User = require('../models/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'eduShare_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(__dirname, '../uploads');
const coversDir = path.join(uploadsDir, 'covers');

[uploadsDir, coversDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Cấu hình multer cho cover image
const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, coversDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uuid = uuidv4().replace(/-/g, '');
        const ext = path.extname(file.originalname);
        const fileName = `cover_${timestamp}_${uuid}${ext}`;
        cb(null, fileName);
    }
});

const coverFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Cover image phải là file hình ảnh'), false);
    }
};

const uploadCover = multer({
    storage: coverStorage,
    fileFilter: coverFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

/**
 * Đăng ký tài khoản mới
 * POST /api/auth/register
 */
exports.CreateAccount = async (req, res) => {
    console.log('\n🔵 ========== CREATE ACCOUNT CALLED ==========');
    console.log('Request received at:', new Date().toISOString());
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
        const { fullName, email, passWord, phone, role } = req.body;
        
        console.log('Extracted data:', { fullName, email, phone, role });

        // Validation
        console.log('🔍 Validating input...');
        if (!fullName || !email || !passWord) {
            console.log('❌ Validation failed: Missing required fields');
            console.log('  - fullName:', fullName ? '✓' : '✗');
            console.log('  - email:', email ? '✓' : '✗');
            console.log('  - passWord:', passWord ? '✓' : '✗');
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin: Họ tên, Email, Mật khẩu' 
            });
        }
        console.log('✅ Validation passed');

        if (passWord.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự' 
            });
        }

        // Kiểm tra email đã tồn tại chưa
        console.log('🔍 Checking if email exists:', email.toLowerCase());
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            console.log('❌ Email already exists');
            return res.status(400).json({ 
                success: false,
                message: 'Email đã được sử dụng. Vui lòng chọn email khác!' 
            });
        }
        console.log('✅ Email is available');

        // Hash password
        console.log('🔐 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passWord, salt);
        console.log('✅ Password hashed');

        // Tạo user mới
        console.log('📝 Creating new user:', { 
            fullName: fullName.trim(), 
            email: email.toLowerCase().trim(),
            role: role || 'student' 
        });

        const newUser = new User({
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            passWord: hashedPassword,
            phone: phone || '',
            role: role || 'student'
        });

        console.log('💾 Saving user to database...');

        // Lưu vào database
        await newUser.save();

        console.log('✅ User saved successfully:', {
            id: newUser._id,
            user_id: newUser.user_id,
            email: newUser.email
        });

        // Tạo JWT token
        console.log('🎫 Generating JWT token...');
        const token = jwt.sign(
            { 
                userId: newUser._id,
                user_id: newUser.user_id,
                email: newUser.email,
                role: newUser.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        console.log('✅ Token generated');

        // Trả về response (không trả về password)
        console.log('📤 Sending success response...');
        const response = {
            success: true,
            message: 'Đăng ký thành công!',
            data: {
                user: {
                    id: newUser._id,
                    user_id: newUser.user_id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role,
                    avatar_url: newUser.avatar_url,
                    is_verified: newUser.is_verified
                },
                token: token
            }
        };
        console.log('✅ Response prepared:', JSON.stringify(response, null, 2));
        console.log('🔵 ========================================\n');
        
        res.status(201).json(response);

    } catch (error) {
        console.error('\n❌ ========== LỖI ĐĂNG KÝ ==========');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        
        if (error.errors) {
            console.error('Error details:');
            Object.keys(error.errors).forEach(key => {
                console.error(`  - ${key}:`, error.errors[key].message);
            });
        }
        
        console.error('Error stack:', error.stack);
        console.error('=====================================\n');
        
        // Xử lý lỗi validation của Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Xử lý lỗi duplicate
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field === 'email' ? 'Email' : field} đã được sử dụng!`
            });
        }

        // Xử lý lỗi MongoDB connection
        if (error.name === 'MongoServerError' || error.message.includes('MongoServerError')) {
            return res.status(500).json({
                success: false,
                message: 'Không thể kết nối database. Vui lòng kiểm tra MongoDB đã chạy chưa!',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        // Xử lý lỗi module không tìm thấy
        if (error.code === 'MODULE_NOT_FOUND') {
            return res.status(500).json({
                success: false,
                message: 'Thiếu package. Vui lòng chạy: npm install',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        res.status(500).json({ 
            success: false,
            message: 'Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau!',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            errorName: process.env.NODE_ENV === 'development' ? error.name : undefined
        });
    }
};

exports.checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ exists: false, message: 'Thiếu email để kiểm tra' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            return res.status(200).json({ exists: true, message: 'Email đã tồn tại' });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error('Lỗi kiểm tra email:', error);
        return res.status(500).json({ exists: false, message: 'Lỗi máy chủ khi kiểm tra email' });
    }
};


/**
 * Đăng nhập
 * POST /api/auth/login
 */
exports.LoginAccount = async (req, res) => {
    try {
        const { email, passWord } = req.body;

        // Validation
        if (!email || !passWord) {
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng nhập email và mật khẩu' 
            });
        }

        // Tìm user theo email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email hoặc mật khẩu không đúng' 
            });
        }

        // Kiểm tra tài khoản có bị khóa không
        if (!user.is_active) {
            return res.status(403).json({ 
                success: false,
                message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin!' 
            });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(passWord, user.passWord);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Email hoặc mật khẩu không đúng' 
            });
        }

        // Cập nhật last_login
        user.last_login = new Date();
        await user.save();

        // Tạo JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Đăng nhập thành công
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: {
                user: {
                    id: user._id,
                    user_id: user.user_id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    avatar_url: user.avatar_url,
                    phone: user.phone,
                    is_verified: user.is_verified,
                    contributions: user.contributions,
                    reputation_score: user.reputation_score
                },
                token: token
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({ 
            success: false,
            message: 'Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau!',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * Lấy thông tin user theo email
 * GET /api/auth/customer?email=...
 */
exports.getCustomerByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email là bắt buộc' 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'Không tìm thấy người dùng' 
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                user_id: user.user_id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                gender: user.gender || '',
                avatar_url: user.avatar_url,
                cover_url: user.cover_url || '',
                bio: user.bio,
                role: user.role,
                university: user.university,
                major: user.major
            }
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin user:', error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi máy chủ' 
        });
    }
};

exports.updateCustomerInfo = async (req, res) => {
    try {
        const { email, phone, address, gender } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });
        const user = await User.findOneAndUpdate(
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
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.send('Email đã được đăng ký!');
        }

        // Hash password nếu chưa hash
        let finalPassword = passWord;
        if (!passWord.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            finalPassword = await bcrypt.hash(passWord, salt);
        }

        // Lưu user vào DB
        const newAccount = new User({ fullName, email: email.toLowerCase(), passWord: finalPassword });
        await newAccount.save();

        res.send('Đăng ký thành công! Bạn có thể đăng nhập.');
    } catch (err) {
        res.status(400).send('Token không hợp lệ hoặc đã hết hạn.');
    }
};

/**
 * Upload cover image
 * POST /api/auth/profile/cover
 */
exports.uploadCoverImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn file ảnh bìa'
            });
        }

        const { email } = req.body;
        if (!email) {
            // Xóa file nếu email không có
            if (req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.error('Error deleting file:', e);
                }
            }
            return res.status(400).json({
                success: false,
                message: 'Email là bắt buộc'
            });
        }

        // Tìm user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Xóa file nếu user không tồn tại
            if (req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.error('Error deleting file:', e);
                }
            }
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Xóa ảnh bìa cũ nếu có
        if (user.cover_url) {
            // Xử lý cả relative path và absolute URL
            let oldCoverPath = user.cover_url;
            if (oldCoverPath.startsWith('http://')) {
                oldCoverPath = oldCoverPath.replace('http://localhost:3001', '');
            }
            oldCoverPath = path.join(__dirname, '..', oldCoverPath);
            if (fs.existsSync(oldCoverPath)) {
                try {
                    fs.unlinkSync(oldCoverPath);
                    console.log('✅ Deleted old cover image:', oldCoverPath);
                } catch (e) {
                    console.error('Error deleting old cover:', e);
                }
            }
        }

        // Cập nhật cover_url
        const coverUrl = `/uploads/covers/${req.file.filename}`;
        user.cover_url = coverUrl;
        await user.save();

        res.json({
            success: true,
            message: 'Upload ảnh bìa thành công',
            data: {
                cover_url: `http://localhost:3001${coverUrl}`
            }
        });
    } catch (error) {
        console.error('Error uploading cover:', error);
        // Xóa file nếu có lỗi
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh bìa',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Export multer middleware
exports.uploadCoverMiddleware = uploadCover.single('cover');