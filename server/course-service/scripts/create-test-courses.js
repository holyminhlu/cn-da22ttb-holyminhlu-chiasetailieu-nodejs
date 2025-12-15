const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/EduShareDB';

// Test courses data - 5 khóa học với giá 5000 VND
const testCourses = [
    {
        title: 'Khóa Học Lập Trình JavaScript Cơ Bản - Test Payment',
        subtitle: 'Học JavaScript từ cơ bản đến nâng cao, xây dựng ứng dụng thực tế',
        description: 'Khóa học JavaScript toàn diện dành cho người mới bắt đầu. Bạn sẽ học các khái niệm cơ bản về biến, hàm, vòng lặp, xử lý sự kiện, DOM manipulation, và nhiều hơn nữa. Khóa học bao gồm các bài tập thực hành và dự án thực tế để bạn có thể áp dụng kiến thức ngay lập tức.',
        instructor: {
            id: 'test_instructor_1',
            name: 'Nguyễn Văn A',
            avatar: '',
            bio: 'Giảng viên với 10 năm kinh nghiệm lập trình web'
        },
        category: 'programming',
        level: 'beginner',
        pricing: {
            isFree: false,
            price: 5000,
            originalPrice: 10000,
            currency: 'VND'
        },
        duration: 8, // hours
        lessonsCount: 15,
        enrolledCount: 0,
        rating: 4.5,
        ratingCount: 0,
        reviewCount: 0,
        tags: ['javascript', 'programming', 'web development', 'beginner'],
        languages: ['vi'],
        whatYouWillLearn: [
            'Hiểu rõ các khái niệm cơ bản của JavaScript',
            'Làm việc với DOM và xử lý sự kiện',
            'Xây dựng ứng dụng web tương tác',
            'Sử dụng ES6+ features'
        ],
        requirements: [
            'Có kiến thức cơ bản về HTML và CSS',
            'Có máy tính với kết nối internet',
            'Có trình duyệt web hiện đại'
        ],
        targetAudience: [
            'Người mới bắt đầu học lập trình',
            'Sinh viên công nghệ thông tin',
            'Người muốn chuyển sang lập trình web'
        ],
        modules: [
            {
                module_id: `module_${uuidv4()}`,
                title: 'Giới thiệu về JavaScript',
                description: 'Tìm hiểu về JavaScript và môi trường phát triển',
                order: 1,
                lessons: [
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'JavaScript là gì?',
                        description: 'Giới thiệu về ngôn ngữ JavaScript',
                        duration: 15,
                        order: 1,
                        isPreview: true
                    },
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'Cài đặt môi trường phát triển',
                        description: 'Hướng dẫn cài đặt các công cụ cần thiết',
                        duration: 20,
                        order: 2
                    }
                ]
            },
            {
                module_id: `module_${uuidv4()}`,
                title: 'Biến và Kiểu dữ liệu',
                description: 'Học về biến, hằng số và các kiểu dữ liệu trong JavaScript',
                order: 2,
                lessons: [
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'Khai báo biến',
                        description: 'Học cách khai báo và sử dụng biến',
                        duration: 25,
                        order: 1
                    }
                ]
            }
        ],
        status: 'published',
        visibility: 'public',
        isBestSeller: false
    },
    {
        title: 'Khóa Học React.js Cho Người Mới Bắt Đầu - Test Payment',
        subtitle: 'Xây dựng ứng dụng web hiện đại với React.js',
        description: 'Khóa học React.js toàn diện giúp bạn nắm vững các khái niệm cơ bản và nâng cao của React. Bạn sẽ học cách xây dựng component, quản lý state, xử lý props, routing, và tích hợp với API. Khóa học bao gồm nhiều dự án thực tế để bạn có thể áp dụng kiến thức vào công việc thực tế.',
        instructor: {
            id: 'test_instructor_2',
            name: 'Trần Thị B',
            avatar: '',
            bio: 'Full-stack developer với 8 năm kinh nghiệm'
        },
        category: 'programming',
        level: 'intermediate',
        pricing: {
            isFree: false,
            price: 5000,
            originalPrice: 15000,
            currency: 'VND'
        },
        duration: 12,
        lessonsCount: 20,
        enrolledCount: 0,
        rating: 4.7,
        ratingCount: 0,
        reviewCount: 0,
        tags: ['react', 'javascript', 'frontend', 'web development'],
        languages: ['vi'],
        whatYouWillLearn: [
            'Xây dựng component với React',
            'Quản lý state với useState và useEffect',
            'Xử lý routing với React Router',
            'Tích hợp API với React'
        ],
        requirements: [
            'Có kiến thức về JavaScript ES6+',
            'Hiểu cơ bản về HTML và CSS',
            'Có máy tính với Node.js đã cài đặt'
        ],
        targetAudience: [
            'Frontend developer',
            'Full-stack developer',
            'Sinh viên muốn học React'
        ],
        modules: [
            {
                module_id: `module_${uuidv4()}`,
                title: 'Giới thiệu React',
                description: 'Tìm hiểu về React và cách setup project',
                order: 1,
                lessons: [
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'React là gì?',
                        description: 'Giới thiệu về React framework',
                        duration: 20,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        status: 'published',
        visibility: 'public',
        isBestSeller: true
    },
    {
        title: 'Khóa Học Thiết Kế UI/UX Cơ Bản - Test Payment',
        subtitle: 'Học thiết kế giao diện người dùng đẹp và thân thiện',
        description: 'Khóa học thiết kế UI/UX toàn diện giúp bạn nắm vững các nguyên tắc thiết kế, màu sắc, typography, layout, và user experience. Bạn sẽ học cách sử dụng các công cụ thiết kế như Figma, Adobe XD, và Sketch. Khóa học bao gồm nhiều case study thực tế và bài tập để bạn có thể áp dụng ngay.',
        instructor: {
            id: 'test_instructor_3',
            name: 'Lê Văn C',
            avatar: '',
            bio: 'UI/UX Designer với 7 năm kinh nghiệm'
        },
        category: 'design',
        level: 'beginner',
        pricing: {
            isFree: false,
            price: 5000,
            originalPrice: 12000,
            currency: 'VND'
        },
        duration: 10,
        lessonsCount: 18,
        enrolledCount: 0,
        rating: 4.6,
        ratingCount: 0,
        reviewCount: 0,
        tags: ['ui/ux', 'design', 'figma', 'user experience'],
        languages: ['vi'],
        whatYouWillLearn: [
            'Nguyên tắc thiết kế UI/UX',
            'Sử dụng màu sắc và typography hiệu quả',
            'Thiết kế responsive và mobile-first',
            'Tạo prototype với Figma'
        ],
        requirements: [
            'Có máy tính với kết nối internet',
            'Có tài khoản Figma (miễn phí)',
            'Có đam mê với thiết kế'
        ],
        targetAudience: [
            'Người mới bắt đầu thiết kế',
            'Developer muốn học thiết kế',
            'Sinh viên thiết kế đồ họa'
        ],
        modules: [
            {
                module_id: `module_${uuidv4()}`,
                title: 'Giới thiệu UI/UX',
                description: 'Tìm hiểu về UI/UX design',
                order: 1,
                lessons: [
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'UI vs UX',
                        description: 'Phân biệt UI và UX',
                        duration: 15,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        status: 'published',
        visibility: 'public',
        isBestSeller: false
    },
    {
        title: 'Khóa Học Python Cho Data Science - Test Payment',
        subtitle: 'Phân tích dữ liệu và Machine Learning với Python',
        description: 'Khóa học Python toàn diện cho Data Science giúp bạn nắm vững các thư viện như NumPy, Pandas, Matplotlib, và Scikit-learn. Bạn sẽ học cách xử lý dữ liệu, phân tích thống kê, visualization, và xây dựng mô hình machine learning cơ bản. Khóa học bao gồm nhiều dự án thực tế với dataset thật.',
        instructor: {
            id: 'test_instructor_4',
            name: 'Phạm Thị D',
            avatar: '',
            bio: 'Data Scientist với 9 năm kinh nghiệm'
        },
        category: 'science',
        level: 'intermediate',
        pricing: {
            isFree: false,
            price: 5000,
            originalPrice: 20000,
            currency: 'VND'
        },
        duration: 15,
        lessonsCount: 25,
        enrolledCount: 0,
        rating: 4.8,
        ratingCount: 0,
        reviewCount: 0,
        tags: ['python', 'data science', 'machine learning', 'pandas'],
        languages: ['vi'],
        whatYouWillLearn: [
            'Xử lý dữ liệu với Pandas',
            'Phân tích thống kê với NumPy',
            'Visualization với Matplotlib',
            'Xây dựng mô hình Machine Learning'
        ],
        requirements: [
            'Có kiến thức cơ bản về Python',
            'Hiểu cơ bản về toán học và thống kê',
            'Có máy tính với Python 3.x đã cài đặt'
        ],
        targetAudience: [
            'Data analyst',
            'Data scientist',
            'Sinh viên muốn học Data Science'
        ],
        modules: [
            {
                module_id: `module_${uuidv4()}`,
                title: 'Giới thiệu Data Science',
                description: 'Tìm hiểu về Data Science và Python',
                order: 1,
                lessons: [
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'Data Science là gì?',
                        description: 'Giới thiệu về Data Science',
                        duration: 20,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        status: 'published',
        visibility: 'public',
        isBestSeller: true
    },
    {
        title: 'Khóa Học Marketing Digital Cơ Bản - Test Payment',
        subtitle: 'Học marketing online hiệu quả cho doanh nghiệp',
        description: 'Khóa học Marketing Digital toàn diện giúp bạn nắm vững các kỹ thuật marketing online như SEO, SEM, Social Media Marketing, Email Marketing, và Content Marketing. Bạn sẽ học cách xây dựng chiến lược marketing, đo lường hiệu quả, và tối ưu hóa chi phí. Khóa học bao gồm nhiều case study thực tế từ các doanh nghiệp thành công.',
        instructor: {
            id: 'test_instructor_5',
            name: 'Hoàng Văn E',
            avatar: '',
            bio: 'Marketing Manager với 12 năm kinh nghiệm'
        },
        category: 'marketing',
        level: 'beginner',
        pricing: {
            isFree: false,
            price: 5000,
            originalPrice: 18000,
            currency: 'VND'
        },
        duration: 14,
        lessonsCount: 22,
        enrolledCount: 0,
        rating: 4.4,
        ratingCount: 0,
        reviewCount: 0,
        tags: ['marketing', 'digital marketing', 'seo', 'social media'],
        languages: ['vi'],
        whatYouWillLearn: [
            'Xây dựng chiến lược Marketing Digital',
            'Tối ưu hóa SEO cho website',
            'Chạy quảng cáo Facebook và Google Ads',
            'Đo lường và phân tích hiệu quả marketing'
        ],
        requirements: [
            'Có máy tính với kết nối internet',
            'Có tài khoản Google và Facebook',
            'Có đam mê với marketing'
        ],
        targetAudience: [
            'Marketing executive',
            'Business owner',
            'Sinh viên marketing'
        ],
        modules: [
            {
                module_id: `module_${uuidv4()}`,
                title: 'Giới thiệu Marketing Digital',
                description: 'Tìm hiểu về Marketing Digital',
                order: 1,
                lessons: [
                    {
                        lesson_id: `lesson_${uuidv4()}`,
                        title: 'Marketing Digital là gì?',
                        description: 'Giới thiệu về Marketing Digital',
                        duration: 18,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        status: 'published',
        visibility: 'public',
        isBestSeller: false
    }
];

async function createTestCourses() {
    try {
        console.log('\n📚 ========== CREATING TEST COURSES ==========');
        console.log(`MongoDB URI: ${MONGODB_URI}`);
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connected to MongoDB');
        
        // Check if courses already exist
        const existingCount = await Course.countDocuments({
            title: { $regex: /Test Payment/i }
        });
        
        if (existingCount > 0) {
            console.log(`⚠️ Found ${existingCount} existing test courses`);
            console.log('Deleting existing test courses...');
            await Course.deleteMany({
                title: { $regex: /Test Payment/i }
            });
            console.log('✅ Deleted existing test courses');
        }
        
        // Create courses
        const createdCourses = [];
        for (let i = 0; i < testCourses.length; i++) {
            const courseData = testCourses[i];
            const course = new Course(courseData);
            await course.save();
            createdCourses.push(course);
            console.log(`✅ Created course ${i + 1}/5: ${course.title}`);
            console.log(`   Course ID: ${course.course_id}`);
            console.log(`   Price: ${course.pricing.price} ${course.pricing.currency}`);
        }
        
        console.log(`\n✅ Successfully created ${createdCourses.length} test courses`);
        console.log('\n📋 Course IDs for testing:');
        createdCourses.forEach((course, index) => {
            console.log(`   ${index + 1}. ${course.title}`);
            console.log(`      ID: ${course.course_id}`);
            console.log(`      Price: ${course.pricing.price} ${course.pricing.currency}`);
        });
        console.log('\n==========================================\n');
        
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating test courses:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run script
createTestCourses();

