<template>
  <div class="help-page">
    <div class="help-container">
      <!-- Header -->
      <header class="help-header">
        <h1 class="help-title">Trợ giúp</h1>
        <p class="help-subtitle">Tìm câu trả lời cho các câu hỏi thường gặp</p>
      </header>

      <!-- Search -->
      <div class="help-search">
        <div class="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Categories -->
      <div class="help-categories">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: activeCategory === category.id }]"
          @click="activeCategory = category.id"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>

      <!-- FAQ Sections -->
      <div class="faq-sections">
        <section
          v-for="category in filteredCategories"
          :key="category.id"
          class="faq-section"
        >
          <h2 class="section-title">
            {{ category.icon }} {{ category.name }}
          </h2>
          <div class="faq-list">
            <div
              v-for="(faq, index) in category.faqs"
              :key="index"
              class="faq-item"
              :class="{ open: openFaq === `${category.id}-${index}` }"
            >
              <button
                class="faq-question"
                @click="toggleFaq(`${category.id}-${index}`)"
              >
                <span>{{ faq.question }}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="faq-icon"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Contact Section -->
      <section class="contact-section">
        <h2 class="section-title">Cần hỗ trợ thêm?</h2>
        <p class="contact-description">
          Nếu bạn không tìm thấy câu trả lời, vui lòng liên hệ với chúng tôi:
        </p>
        <div class="contact-methods">
          <a href="mailto:support@edushare.vn" class="contact-method">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <div>
              <strong>Email</strong>
              <span>support@edushare.vn</span>
            </div>
          </a>
          <div class="contact-method">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <div>
              <strong>Hotline</strong>
              <span>0983 149 203</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'HelpView',
  setup() {
    const searchQuery = ref('')
    const activeCategory = ref('all')
    const openFaq = ref(null)

    const categories = [
      { id: 'all', name: 'Tất cả', icon: '📚' },
      { id: 'getting-started', name: 'Bắt đầu', icon: '🚀' },
      { id: 'documents', name: 'Tài liệu', icon: '📄' },
      { id: 'account', name: 'Tài khoản', icon: '👤' },
      { id: 'technical', name: 'Kỹ thuật', icon: '⚙️' }
    ]

    const allFaqs = [
      {
        category: 'getting-started',
        faqs: [
          {
            question: 'Làm thế nào để đăng ký tài khoản?',
            answer: 'Bạn có thể đăng ký tài khoản bằng cách nhấp vào nút "Đăng ký" ở góc trên bên phải trang web. Sau đó điền đầy đủ thông tin bao gồm họ tên, email và mật khẩu. Bạn sẽ nhận được email xác nhận để kích hoạt tài khoản.'
          },
          {
            question: 'Làm thế nào để đăng nhập?',
            answer: 'Nhấp vào nút "Đăng nhập" ở góc trên bên phải, sau đó nhập email và mật khẩu đã đăng ký. Bạn cũng có thể đăng nhập bằng Google hoặc Facebook nếu đã liên kết tài khoản.'
          },
          {
            question: 'Quên mật khẩu thì làm sao?',
            answer: 'Tại trang đăng nhập, nhấp vào liên kết "Quên mật khẩu". Nhập email đã đăng ký và bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu mới.'
          }
        ]
      },
      {
        category: 'documents',
        faqs: [
          {
            question: 'Làm thế nào để tải lên tài liệu?',
            answer: 'Sau khi đăng nhập, nhấp vào nút "Tải lên tài liệu" ở header hoặc trong menu tài khoản. Chọn file cần tải lên (PDF, PowerPoint, Word), điền thông tin mô tả và nhấn "Tải lên". Hệ thống sẽ xử lý và hiển thị tài liệu của bạn sau khi duyệt.'
          },
          {
            question: 'Những định dạng file nào được hỗ trợ?',
            answer: 'Hệ thống hỗ trợ các định dạng: PDF (.pdf), PowerPoint (.ppt, .pptx), Word (.doc, .docx), và video (.mp4, .avi). Kích thước file tối đa là 100MB.'
          },
          {
            question: 'Làm thế nào để tìm kiếm tài liệu?',
            answer: 'Sử dụng thanh tìm kiếm ở trang chủ hoặc trang Tài liệu. Bạn có thể tìm theo tên tài liệu, tác giả, mã học phần, hoặc sử dụng các bộ lọc theo môn học, chương trình, năm học.'
          },
          {
            question: 'Làm thế nào để lưu (bookmark) tài liệu?',
            answer: 'Khi xem một tài liệu, nhấp vào biểu tượng bookmark ở góc trên bên phải của card tài liệu. Tài liệu đã lưu sẽ xuất hiện trong mục "Đã lưu" trong profile của bạn.'
          },
          {
            question: 'Làm thế nào để tải xuống tài liệu?',
            answer: 'Nhấp vào nút "Tải xuống" trên card tài liệu hoặc trong trang chi tiết tài liệu. Một số tài liệu có thể yêu cầu đăng nhập hoặc có giới hạn số lần tải xuống.'
          }
        ]
      },
      {
        category: 'account',
        faqs: [
          {
            question: 'Làm thế nào để cập nhật thông tin cá nhân?',
            answer: 'Nhấp vào avatar của bạn ở header, chọn "Hồ sơ" hoặc "Cài đặt". Tại đây bạn có thể cập nhật thông tin cá nhân, ảnh đại diện, mô tả bản thân và các tùy chọn khác.'
          },
          {
            question: 'Làm thế nào để đổi mật khẩu?',
            answer: 'Vào "Cài đặt" > "Bảo mật" trong menu tài khoản, sau đó nhấp vào "Đổi mật khẩu". Nhập mật khẩu cũ và mật khẩu mới, sau đó xác nhận.'
          },
          {
            question: 'Làm thế nào để xem tài liệu đã tải lên?',
            answer: 'Nhấp vào avatar của bạn, chọn "Tài liệu của tôi" trong menu dropdown. Tại đây bạn sẽ thấy tất cả tài liệu bạn đã tải lên, có thể lọc và sắp xếp theo nhiều tiêu chí.'
          },
          {
            question: 'Làm thế nào để xem tài liệu đã lưu?',
            answer: 'Nhấp vào avatar của bạn, chọn "Đã lưu" trong menu dropdown. Tất cả tài liệu bạn đã bookmark sẽ được hiển thị ở đây.'
          },
          {
            question: 'Điểm uy tín là gì?',
            answer: 'Điểm uy tín được tính dựa trên số tài liệu bạn chia sẻ, lượt tải xuống, đánh giá nhận được và các hoạt động tích cực khác trên nền tảng. Điểm uy tín cao giúp bạn có nhiều đặc quyền hơn.'
          }
        ]
      },
      {
        category: 'technical',
        faqs: [
          {
            question: 'Tại sao không thể tải lên file?',
            answer: 'Kiểm tra lại: (1) File có đúng định dạng được hỗ trợ, (2) Kích thước file không vượt quá 100MB, (3) Kết nối internet ổn định, (4) Bạn đã đăng nhập. Nếu vẫn lỗi, vui lòng liên hệ hỗ trợ.'
          },
          {
            question: 'Trang web chạy chậm phải làm sao?',
            answer: 'Thử các cách sau: (1) Xóa cache trình duyệt, (2) Sử dụng trình duyệt mới nhất, (3) Kiểm tra kết nối internet, (4) Tắt các extension có thể gây xung đột. Nếu vẫn chậm, vui lòng báo cáo cho chúng tôi.'
          },
          {
            question: 'Làm thế nào để báo cáo lỗi?',
            answer: 'Nếu bạn gặp lỗi, vui lòng gửi email đến support@edushare.vn kèm theo mô tả chi tiết lỗi, ảnh chụp màn hình (nếu có), và trình duyệt bạn đang sử dụng.'
          },
          {
            question: 'Tại sao không thể đăng nhập?',
            answer: 'Kiểm tra lại: (1) Email và mật khẩu đúng, (2) Đã xác nhận email (nếu là tài khoản mới), (3) Tài khoản chưa bị khóa. Nếu vẫn không được, sử dụng tính năng "Quên mật khẩu" hoặc liên hệ hỗ trợ.'
          }
        ]
      }
    ]

    const toggleFaq = (faqId) => {
      openFaq.value = openFaq.value === faqId ? null : faqId
    }

    const filteredCategories = computed(() => {
      let filtered = allFaqs.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(faq => {
          const matchesCategory = activeCategory.value === 'all' || cat.category === activeCategory.value
          const matchesSearch = searchQuery.value === '' ||
            faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
          return matchesCategory && matchesSearch
        })
      })).filter(cat => cat.faqs.length > 0)

      return filtered
    })

    return {
      searchQuery,
      activeCategory,
      openFaq,
      categories,
      filteredCategories,
      toggleFaq
    }
  }
}
</script>

<style scoped>
.help-page {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
  padding-top: 80px;
}

.help-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.help-header {
  text-align: center;
  margin-bottom: 2rem;
}

.help-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.help-subtitle {
  font-size: 1.125rem;
  color: #718096;
}

.help-search {
  margin-bottom: 2rem;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: #4f46e5;
}

.search-box svg {
  color: #718096;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #1a202c;
}

.search-input::placeholder {
  color: #a0aec0;
}

.help-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.category-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.category-btn.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.faq-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.faq-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.faq-item:hover {
  border-color: #cbd5e0;
}

.faq-item.open {
  border-color: #4f46e5;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  cursor: pointer;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background: #f7fafc;
}

.faq-icon {
  flex-shrink: 0;
  transition: transform 0.2s;
  color: #718096;
}

.faq-item.open .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out, padding 0.3s ease-out;
  padding: 0 1.5rem;
}

.faq-item.open .faq-answer {
  max-height: 500px;
  padding: 0 1.5rem 1.5rem;
}

.faq-answer p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.contact-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 3rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-description {
  color: #718096;
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  min-width: 250px;
}

.contact-method:hover {
  border-color: #4f46e5;
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.contact-method svg {
  color: #4f46e5;
  flex-shrink: 0;
}

.contact-method div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.contact-method strong {
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.contact-method span {
  color: #718096;
  font-size: 0.9375rem;
}

@media (max-width: 768px) {
  .help-title {
    font-size: 2rem;
  }

  .help-categories {
    justify-content: flex-start;
  }

  .faq-section {
    padding: 1.5rem;
  }

  .contact-methods {
    flex-direction: column;
    align-items: stretch;
  }

  .contact-method {
    min-width: auto;
  }
}
</style>

