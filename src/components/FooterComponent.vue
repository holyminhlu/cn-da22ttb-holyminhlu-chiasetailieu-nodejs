<template>
  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <!-- Main Footer Content -->
      <div class="footer-content">
        <!-- About Section -->
        <div class="footer-section">
          <h3 class="footer-logo">
            <img
              src="/img/Logo/LogoWeb.png"
              alt="Open Learn Foundation"
              class="footer-logo-img"
            />
          </h3>
          <p class="footer-desc">Nền tảng chia sẻ tri thức và học tập cộng đồng</p>
          <p class="footer-tagline">Learn & Share Together</p>
          
          <div class="contact-info">
            <div class="contact-item">
              <span class="icon">📍</span>
              <span>Trường Đại học Trà Vinh</span>
            </div>
            <div class="contact-item">
              <span class="icon">📧</span>
              <span>contact@edushare.edu.vn</span>
            </div>
            <div class="contact-item">
              <span class="icon">📞</span>
              <span>0983 149 203</span>
            </div>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="footer-section">
          <h4 class="footer-title">Liên kết nhanh</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Trang chủ</a></li>
            <li><a href="#" class="footer-link">Tài liệu</a></li>
            <li><a href="#" class="footer-link">Khóa học</a></li>
            <li><a href="#" class="footer-link">Diễn đàn</a></li>
            <li><a href="#" class="footer-link">Blog</a></li>
          </ul>
        </div>
        
        <!-- Support -->
        <div class="footer-section">
          <h4 class="footer-title">Hỗ trợ</h4>
          <ul class="footer-links">
            <li><a href="#" class="footer-link">Trung tâm trợ giúp</a></li>
            <li><a href="#" class="footer-link">Hướng dẫn sử dụng</a></li>
            <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
            <li><a href="#" class="footer-link">Điều khoản sử dụng</a></li>
            <li><a href="#" class="footer-link">Liên hệ</a></li>
          </ul>
        </div>
        
        <!-- Social & Newsletter -->
        <div class="footer-section">
          <h4 class="footer-title">Kết nối với chúng tôi</h4>
          <div class="social-links">
            <a href="#" class="social-link facebook" title="Facebook">
              <span class="social-icon">f</span>
            </a>
            <a href="#" class="social-link youtube" title="YouTube">
              <span class="social-icon">▶</span>
            </a>
            <a href="#" class="social-link discord" title="Discord">
              <span class="social-icon">D</span>
            </a>
            <a href="#" class="social-link tiktok" title="TikTok">
              <span class="social-icon">♪</span>
            </a>
          </div>
          
          <div class="newsletter">
            <h5 class="newsletter-title">Đăng ký nhận tin</h5>
            <div class="newsletter-form">
              <input type="email" placeholder="Email của bạn" class="newsletter-input">
              <button class="newsletter-btn">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © 2024 EduShare. Tất cả quyền được bảo lưu.
          </p>
          <p class="project-info">
            Đồ án Chuyên ngành CNTT - Sinh viên DA22TTB<br>
            Trường Kỹ thuật và Công nghệ, Đại học Trà Vinh
          </p>
          <p class="team-info">
            Phát triển bởi: Hồ Lý Minh Lữ
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Footer Styles */
.footer {
  background: #1f2937;
  color: white;
  padding: 3rem 0 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Logo Section */
.footer-logo {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.footer-logo-img {
  height: 120px;
  width: auto;
}

.footer-desc {
  color: #d1d5db;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.footer-tagline {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
  font-size: 0.9rem;
}

.contact-item .icon {
  font-size: 1.2rem;
}

/* Footer Sections */
.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  color: #f9fafb;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-link {
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.footer-link:hover {
  color: #4f46e5;
  padding-left: 5px;
}

/* Social Links */
.social-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 600;
}

.social-link.facebook {
  background: #1877f2;
  color: white;
}

.social-link.youtube {
  background: #ff0000;
  color: white;
}

.social-link.discord {
  background: #5865f2;
  color: white;
}

.social-link.tiktok {
  background: linear-gradient(45deg, #00f2ea, #ff0050);
  color: white;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.social-icon {
  font-size: 1.2rem;
}

/* Newsletter */
.newsletter {
  margin-top: 1rem;
}

.newsletter-title {
  color: #f9fafb;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s;
}

.newsletter-input::placeholder {
  color: #9ca3af;
}

.newsletter-input:focus {
  border-color: #4f46e5;
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-btn {
  padding: 0.6rem 1.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.newsletter-btn:hover {
  background: #4338ca;
  transform: translateY(-2px);
}

/* Footer Bottom */
.footer-bottom {
  padding: 2rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.footer-bottom-content {
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
  line-height: 1.8;
}

.copyright {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.project-info {
  margin-bottom: 0.5rem;
  color: #d1d5db;
}

.team-info {
  color: #6b7280;
  font-size: 0.85rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .contact-info {
    align-items: center;
  }
  
  .footer-links {
    align-items: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-btn {
    width: 100%;
  }
}
</style>