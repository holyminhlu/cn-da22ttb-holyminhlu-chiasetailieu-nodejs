const mongoose = require('mongoose');
const Course = require('./models/courseModel');

// Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/EduShareDB')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        importCourses();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const sampleCourses = [
    {
        title: "Lập trình Python từ Cơ bản đến Nâng cao",
        subtitle: "Học Python một cách có hệ thống, từ những kiến thức cơ bản nhất đến các ứng dụng thực tế",
        description: "Khóa học toàn diện về Python, từ cú pháp cơ bản đến các thư viện phức tạp. Bạn sẽ học được cách xây dựng ứng dụng web, phân tích dữ liệu, và tự động hóa công việc. Khóa học bao gồm nhiều bài tập thực hành và dự án thực tế.",
        instructor: {
            id: "user_instructor_001",
            name: "TS. Nguyễn Văn An",
            avatar: "/img/default-avatar.png",
            bio: "Chuyên gia lập trình với 15 năm kinh nghiệm"
        },
        category: "programming",
        level: "beginner",
        modules: [
            {
                module_id: "module_001",
                title: "Giới thiệu về Python",
                description: "Tìm hiểu về Python và môi trường phát triển",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_001",
                        title: "Python là gì?",
                        description: "Giới thiệu về ngôn ngữ lập trình Python",
                        duration: 15,
                        order: 1,
                        isPreview: true
                    },
                    {
                        lesson_id: "lesson_002",
                        title: "Cài đặt Python",
                        description: "Hướng dẫn cài đặt Python và IDE",
                        duration: 20,
                        order: 2
                    }
                ]
            },
            {
                module_id: "module_002",
                title: "Cú pháp cơ bản",
                description: "Học các khái niệm cơ bản của Python",
                order: 2,
                lessons: [
                    {
                        lesson_id: "lesson_003",
                        title: "Biến và Kiểu dữ liệu",
                        description: "Tìm hiểu về biến và các kiểu dữ liệu trong Python",
                        duration: 25,
                        order: 1,
                        isPreview: true
                    },
                    {
                        lesson_id: "lesson_004",
                        title: "Toán tử và Biểu thức",
                        description: "Các toán tử và cách sử dụng biểu thức",
                        duration: 20,
                        order: 2
                    }
                ]
            }
        ],
        pricing: {
            isFree: true,
            price: 0,
            originalPrice: 0,
            currency: "VND"
        },
        duration: 25,
        lessonsCount: 4,
        enrolledCount: 1250,
        rating: 4.7,
        ratingCount: 320,
        reviewCount: 280,
        tags: ["python", "lập trình", "programming", "coding"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Nắm vững cú pháp Python cơ bản",
            "Xây dựng ứng dụng Python thực tế",
            "Làm việc với dữ liệu và file",
            "Sử dụng các thư viện Python phổ biến"
        ],
        requirements: [
            "Không cần kinh nghiệm lập trình trước",
            "Có máy tính với kết nối internet"
        ],
        targetAudience: [
            "Người mới bắt đầu học lập trình",
            "Sinh viên công nghệ thông tin",
            "Người muốn chuyển sang Python"
        ],
        isBestSeller: true,
        status: "published",
        visibility: "public"
    },
    {
        title: "Thiết kế UI/UX cho Web và Mobile",
        subtitle: "Master design principles và tạo ra những giao diện đẹp mắt, thân thiện với người dùng",
        description: "Khóa học toàn diện về thiết kế UI/UX, từ lý thuyết đến thực hành. Học cách tạo wireframes, mockups, và prototypes. Nắm vững nguyên tắc thiết kế, typography, màu sắc, và layout. Áp dụng ngay vào các dự án thực tế.",
        instructor: {
            id: "user_instructor_002",
            name: "Cô Lê Thị Bình",
            avatar: "/img/default-avatar.png",
            bio: "UI/UX Designer với 10 năm kinh nghiệm tại các công ty công nghệ hàng đầu"
        },
        category: "design",
        level: "intermediate",
        modules: [
            {
                module_id: "module_003",
                title: "Nguyên tắc Thiết kế",
                description: "Tìm hiểu các nguyên tắc cơ bản của thiết kế",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_005",
                        title: "Typography và Hierarchy",
                        description: "Học cách sử dụng typography hiệu quả",
                        duration: 30,
                        order: 1,
                        isPreview: true
                    },
                    {
                        lesson_id: "lesson_006",
                        title: "Màu sắc và Contrast",
                        description: "Nguyên tắc sử dụng màu sắc trong thiết kế",
                        duration: 25,
                        order: 2
                    }
                ]
            }
        ],
        pricing: {
            isFree: false,
            price: 599000,
            originalPrice: 999000,
            currency: "VND"
        },
        duration: 18,
        lessonsCount: 12,
        enrolledCount: 890,
        rating: 4.8,
        ratingCount: 245,
        reviewCount: 210,
        tags: ["ui", "ux", "design", "web-design", "mobile-design"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Nguyên tắc thiết kế UI/UX chuyên nghiệp",
            "Sử dụng công cụ thiết kế như Figma, Sketch",
            "Tạo wireframes và prototypes",
            "Thiết kế responsive cho web và mobile"
        ],
        requirements: [
            "Có máy tính với kết nối internet",
            "Nên có hiểu biết cơ bản về design"
        ],
        targetAudience: [
            "Designer muốn nâng cao kỹ năng",
            "Developer muốn học thiết kế",
            "Người muốn chuyển sang nghề UI/UX"
        ],
        isBestSeller: true,
        status: "published",
        visibility: "public"
    },
    {
        title: "Marketing Digital - Chiến lược và Thực hành",
        subtitle: "Học cách xây dựng chiến lược marketing digital hiệu quả và áp dụng vào thực tế",
        description: "Khóa học marketing digital toàn diện, từ SEO, SEM đến social media marketing. Học cách phân tích đối tượng mục tiêu, tạo nội dung, chạy quảng cáo, và đo lường hiệu quả. Có nhiều case study thực tế từ các thương hiệu lớn.",
        instructor: {
            id: "user_instructor_003",
            name: "Anh Trần Văn Cường",
            avatar: "/img/default-avatar.png",
            bio: "Marketing Director với 12 năm kinh nghiệm trong ngành"
        },
        category: "marketing",
        level: "intermediate",
        modules: [
            {
                module_id: "module_004",
                title: "Nền tảng Marketing Digital",
                description: "Tìm hiểu các khái niệm cơ bản",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_007",
                        title: "Tổng quan về Marketing Digital",
                        description: "Giới thiệu về marketing digital và các kênh chính",
                        duration: 20,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: false,
            price: 799000,
            originalPrice: 1299000,
            currency: "VND"
        },
        duration: 30,
        lessonsCount: 20,
        enrolledCount: 1560,
        rating: 4.6,
        ratingCount: 420,
        reviewCount: 380,
        tags: ["marketing", "digital-marketing", "seo", "social-media"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Xây dựng chiến lược marketing digital",
            "SEO và SEM hiệu quả",
            "Quản lý quảng cáo trên Google và Facebook",
            "Phân tích và đo lường hiệu quả marketing"
        ],
        requirements: [
            "Có hiểu biết cơ bản về marketing",
            "Có máy tính với kết nối internet"
        ],
        targetAudience: [
            "Marketer muốn nâng cao kỹ năng",
            "Doanh nhân muốn marketing sản phẩm",
            "Sinh viên marketing"
        ],
        isBestSeller: false,
        status: "published",
        visibility: "public"
    },
    {
        title: "Tiếng Anh Giao tiếp Thương mại",
        subtitle: "Nâng cao kỹ năng giao tiếp tiếng Anh trong môi trường công việc",
        description: "Khóa học tiếng Anh giao tiếp chuyên biệt cho môi trường làm việc. Học cách viết email, thuyết trình, đàm phán, và giao tiếp với đồng nghiệp quốc tế. Có nhiều tình huống thực tế và bài tập thực hành.",
        instructor: {
            id: "user_instructor_004",
            name: "Cô Sarah Johnson",
            avatar: "/img/default-avatar.png",
            bio: "Giáo viên tiếng Anh bản ngữ với chứng chỉ TESOL"
        },
        category: "language",
        level: "intermediate",
        modules: [
            {
                module_id: "module_005",
                title: "Giao tiếp Cơ bản trong Công việc",
                description: "Học các mẫu câu giao tiếp thường dùng",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_008",
                        title: "Giới thiệu bản thân trong công việc",
                        description: "Cách giới thiệu bản thân chuyên nghiệp",
                        duration: 15,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: true,
            price: 0,
            originalPrice: 0,
            currency: "VND"
        },
        duration: 20,
        lessonsCount: 15,
        enrolledCount: 2100,
        rating: 4.9,
        ratingCount: 580,
        reviewCount: 520,
        tags: ["tiếng-anh", "giao-tiếp", "business-english", "communication"],
        languages: ["vi", "en"],
        whatYouWillLearn: [
            "Giao tiếp tiếng Anh tự tin trong công việc",
            "Viết email và tài liệu chuyên nghiệp",
            "Thuyết trình bằng tiếng Anh",
            "Đàm phán và thảo luận với đối tác quốc tế"
        ],
        requirements: [
            "Có trình độ tiếng Anh cơ bản",
            "Có máy tính với kết nối internet"
        ],
        targetAudience: [
            "Nhân viên văn phòng",
            "Người làm việc với đối tác quốc tế",
            "Sinh viên chuẩn bị đi làm"
        ],
        isBestSeller: true,
        status: "published",
        visibility: "public"
    },
    {
        title: "Khoa học Dữ liệu với Python và Machine Learning",
        subtitle: "Học cách phân tích dữ liệu và xây dựng mô hình machine learning",
        description: "Khóa học toàn diện về data science, từ phân tích dữ liệu cơ bản đến xây dựng mô hình machine learning. Học cách sử dụng pandas, numpy, scikit-learn, và các công cụ khác. Có nhiều dự án thực tế với dữ liệu thật.",
        instructor: {
            id: "user_instructor_005",
            name: "GS. Phạm Văn Đức",
            avatar: "/img/default-avatar.png",
            bio: "Chuyên gia Data Science với 20 năm nghiên cứu và giảng dạy"
        },
        category: "science",
        level: "advanced",
        modules: [
            {
                module_id: "module_006",
                title: "Giới thiệu về Data Science",
                description: "Tìm hiểu về khoa học dữ liệu và các ứng dụng",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_009",
                        title: "Data Science là gì?",
                        description: "Giới thiệu về data science và machine learning",
                        duration: 25,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: false,
            price: 1299000,
            originalPrice: 1999000,
            currency: "VND"
        },
        duration: 40,
        lessonsCount: 30,
        enrolledCount: 680,
        rating: 4.7,
        ratingCount: 180,
        reviewCount: 150,
        tags: ["data-science", "machine-learning", "python", "ai"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Phân tích dữ liệu với pandas và numpy",
            "Xây dựng mô hình machine learning",
            "Xử lý dữ liệu lớn",
            "Visualization và báo cáo dữ liệu"
        ],
        requirements: [
            "Có kiến thức cơ bản về Python",
            "Có hiểu biết về toán thống kê",
            "Có máy tính với kết nối internet"
        ],
        targetAudience: [
            "Data analyst muốn nâng cao",
            "Developer muốn học ML",
            "Sinh viên công nghệ thông tin"
        ],
        isBestSeller: false,
        status: "published",
        visibility: "public"
    },
    {
        title: "Kinh doanh Online - Bán hàng trên Sàn Thương mại Điện tử",
        subtitle: "Học cách bán hàng hiệu quả trên các sàn thương mại điện tử như Shopee, Lazada, Tiki",
        description: "Khóa học thực tế về kinh doanh online, từ setup shop đến tối ưu hóa doanh số. Học cách nghiên cứu thị trường, tạo listing hấp dẫn, quản lý đơn hàng, và chạy quảng cáo. Có nhiều case study thực tế từ các shop thành công.",
        instructor: {
            id: "user_instructor_006",
            name: "Anh Hoàng Văn Em",
            avatar: "/img/default-avatar.png",
            bio: "Doanh nhân với 8 năm kinh nghiệm kinh doanh online, doanh số hàng tỷ"
        },
        category: "business",
        level: "beginner",
        modules: [
            {
                module_id: "module_007",
                title: "Bắt đầu Kinh doanh Online",
                description: "Tìm hiểu về các sàn thương mại điện tử",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_010",
                        title: "Tổng quan về E-commerce",
                        description: "Giới thiệu về kinh doanh online và các sàn TMĐT",
                        duration: 20,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: true,
            price: 0,
            originalPrice: 0,
            currency: "VND"
        },
        duration: 22,
        lessonsCount: 18,
        enrolledCount: 1890,
        rating: 4.5,
        ratingCount: 320,
        reviewCount: 290,
        tags: ["kinh-doanh", "ecommerce", "online-business", "shopee", "lazada"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Setup shop trên các sàn TMĐT",
            "Tạo listing sản phẩm hấp dẫn",
            "Quản lý đơn hàng và vận chuyển",
            "Chạy quảng cáo và tăng doanh số"
        ],
        requirements: [
            "Có máy tính với kết nối internet",
            "Có tài khoản trên các sàn TMĐT"
        ],
        targetAudience: [
            "Người muốn bắt đầu kinh doanh online",
            "Chủ shop muốn nâng cao doanh số",
            "Sinh viên kinh tế"
        ],
        isBestSeller: true,
        status: "published",
        visibility: "public"
    },
    {
        title: "React.js - Xây dựng Ứng dụng Web Hiện đại",
        subtitle: "Học React từ cơ bản đến nâng cao, xây dựng ứng dụng web thực tế",
        description: "Khóa học React.js toàn diện, từ components cơ bản đến state management, routing, và API integration. Học cách xây dựng SPA (Single Page Application) với React. Có nhiều dự án thực tế từ đơn giản đến phức tạp.",
        instructor: {
            id: "user_instructor_007",
            name: "Anh Lê Minh Tuấn",
            avatar: "/img/default-avatar.png",
            bio: "Senior Frontend Developer với 10 năm kinh nghiệm"
        },
        category: "programming",
        level: "intermediate",
        modules: [
            {
                module_id: "module_008",
                title: "Giới thiệu về React",
                description: "Tìm hiểu về React và tại sao nên dùng React",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_011",
                        title: "React là gì?",
                        description: "Giới thiệu về React và ecosystem",
                        duration: 20,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: false,
            price: 899000,
            originalPrice: 1499000,
            currency: "VND"
        },
        duration: 35,
        lessonsCount: 25,
        enrolledCount: 1120,
        rating: 4.8,
        ratingCount: 380,
        reviewCount: 340,
        tags: ["react", "javascript", "frontend", "web-development"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Xây dựng ứng dụng React từ đầu",
            "Quản lý state với Hooks và Context",
            "Routing với React Router",
            "Tích hợp API và authentication"
        ],
        requirements: [
            "Có kiến thức về JavaScript và HTML/CSS",
            "Có máy tính với kết nối internet"
        ],
        targetAudience: [
            "Frontend developer muốn học React",
            "Developer muốn nâng cao kỹ năng",
            "Sinh viên công nghệ thông tin"
        ],
        isBestSeller: true,
        status: "published",
        visibility: "public"
    },
    {
        title: "Kế toán và Tài chính cho Doanh nghiệp Nhỏ",
        subtitle: "Học cách quản lý tài chính và kế toán cho doanh nghiệp của bạn",
        description: "Khóa học thực tế về kế toán và tài chính, từ sổ sách cơ bản đến báo cáo tài chính. Học cách quản lý dòng tiền, lập ngân sách, và phân tích tài chính. Có nhiều ví dụ thực tế và template có thể sử dụng ngay.",
        instructor: {
            id: "user_instructor_008",
            name: "CPA. Nguyễn Thị Lan",
            avatar: "/img/default-avatar.png",
            bio: "Kế toán trưởng với 15 năm kinh nghiệm"
        },
        category: "business",
        level: "beginner",
        modules: [
            {
                module_id: "module_009",
                title: "Nguyên tắc Kế toán Cơ bản",
                description: "Tìm hiểu về kế toán và các khái niệm cơ bản",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_012",
                        title: "Kế toán là gì?",
                        description: "Giới thiệu về kế toán và vai trò trong doanh nghiệp",
                        duration: 18,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: true,
            price: 0,
            originalPrice: 0,
            currency: "VND"
        },
        duration: 28,
        lessonsCount: 22,
        enrolledCount: 1450,
        rating: 4.6,
        ratingCount: 280,
        reviewCount: 250,
        tags: ["kế-toán", "tài-chính", "business", "accounting"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Nguyên tắc kế toán cơ bản",
            "Quản lý sổ sách và chứng từ",
            "Lập báo cáo tài chính",
            "Phân tích tài chính doanh nghiệp"
        ],
        requirements: [
            "Có máy tính với kết nối internet",
            "Có hiểu biết cơ bản về Excel"
        ],
        targetAudience: [
            "Chủ doanh nghiệp nhỏ",
            "Kế toán viên mới vào nghề",
            "Sinh viên kinh tế"
        ],
        isBestSeller: false,
        status: "published",
        visibility: "public"
    },
    {
        title: "Node.js và Express - Xây dựng Backend API",
        subtitle: "Học cách xây dựng RESTful API với Node.js và Express",
        description: "Khóa học toàn diện về backend development với Node.js và Express. Học cách xây dựng RESTful API, kết nối database, authentication, và deployment. Có nhiều dự án thực tế từ đơn giản đến phức tạp.",
        instructor: {
            id: "user_instructor_009",
            name: "Anh Đỗ Văn Hùng",
            avatar: "/img/default-avatar.png",
            bio: "Full-stack Developer với 12 năm kinh nghiệm"
        },
        category: "programming",
        level: "advanced",
        modules: [
            {
                module_id: "module_010",
                title: "Giới thiệu về Node.js",
                description: "Tìm hiểu về Node.js và môi trường runtime",
                order: 1,
                lessons: [
                    {
                        lesson_id: "lesson_013",
                        title: "Node.js là gì?",
                        description: "Giới thiệu về Node.js và npm",
                        duration: 22,
                        order: 1,
                        isPreview: true
                    }
                ]
            }
        ],
        pricing: {
            isFree: false,
            price: 999000,
            originalPrice: 1699000,
            currency: "VND"
        },
        duration: 38,
        lessonsCount: 28,
        enrolledCount: 950,
        rating: 4.7,
        ratingCount: 250,
        reviewCount: 220,
        tags: ["nodejs", "express", "backend", "api", "javascript"],
        languages: ["vi"],
        whatYouWillLearn: [
            "Xây dựng RESTful API với Express",
            "Kết nối và làm việc với MongoDB",
            "Authentication và Authorization",
            "Deploy ứng dụng lên server"
        ],
        requirements: [
            "Có kiến thức về JavaScript",
            "Có hiểu biết về HTTP và REST",
            "Có máy tính với kết nối internet"
        ],
        targetAudience: [
            "Backend developer",
            "Full-stack developer",
            "Sinh viên công nghệ thông tin"
        ],
        isBestSeller: false,
        status: "published",
        visibility: "public"
    }
];

async function importCourses() {
    try {
        console.log('\n📚 ========== IMPORTING COURSES ==========');
        
        // Xóa các khóa học cũ nếu có (tùy chọn)
        // await Course.deleteMany({});
        // console.log('✅ Cleared old courses');
        
        // Import courses
        for (const courseData of sampleCourses) {
            const course = new Course(courseData);
            await course.save();
            console.log(`✅ Imported: ${course.title}`);
        }
        
        console.log(`\n✅ Successfully imported ${sampleCourses.length} courses`);
        console.log('=========================================\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error importing courses:', error);
        process.exit(1);
    }
}

