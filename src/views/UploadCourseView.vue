<template>
  <div class="upload-course-page">
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">📚 Tạo Khóa Học Mới</h1>
        <p class="page-subtitle">Tạo và chia sẻ khóa học của bạn với cộng đồng</p>
      </div>

      <!-- Access Denied Message -->
      <div v-if="!isLoggedIn" class="access-denied">
        <div class="denied-icon">🔒</div>
        <h2>Bạn cần đăng nhập</h2>
        <p>Vui lòng đăng nhập để tạo khóa học mới.</p>
        <router-link to="/auth" class="btn-login">Đăng nhập</router-link>
      </div>

      <div v-else-if="!isInstructor" class="access-denied">
        <div class="denied-icon">👨‍🏫</div>
        <h2>Chỉ dành cho giảng viên</h2>
        <p>Bạn cần có vai trò giảng viên để tạo khóa học. Vui lòng liên hệ quản trị viên để được cấp quyền.</p>
        <router-link to="/courses" class="btn-back">Quay lại</router-link>
      </div>

      <!-- Upload Form -->
      <form v-else @submit.prevent="handleSubmit" class="upload-form">
        <!-- Step Indicator -->
        <div class="step-indicator">
          <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-label">Thông tin cơ bản</div>
          </div>
          <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
          <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-label">Nội dung khóa học</div>
          </div>
          <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
          <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <div class="step-label">Xem lại & Hoàn tất</div>
          </div>
        </div>

        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="form-step">
          <h2 class="step-title">Thông tin cơ bản</h2>

          <!-- Thumbnail Upload -->
          <div class="form-group">
            <label class="form-label required">Ảnh đại diện khóa học</label>
            <div class="thumbnail-upload">
              <div v-if="!thumbnailPreview" class="upload-placeholder">
                <input
                  type="file"
                  ref="thumbnailInput"
                  accept="image/*"
                  @change="handleThumbnailChange"
                  class="file-input"
                  id="thumbnail-upload"
                />
                <label for="thumbnail-upload" class="upload-label">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Chọn ảnh đại diện</span>
                  <small>JPG, PNG (tối đa 5MB)</small>
                </label>
              </div>
              <div v-else class="thumbnail-preview">
                <img :src="thumbnailPreview" alt="Thumbnail preview" />
                <button type="button" class="btn-remove" @click="removeThumbnail">✕</button>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label for="course-title" class="form-label required">Tên khóa học</label>
            <input
              id="course-title"
              v-model="formData.title"
              type="text"
              class="form-input"
              :class="{ error: errors.title }"
              placeholder="Ví dụ: Lập trình Web với React"
              maxlength="200"
              required
            />
            <span class="form-help">{{ formData.title.length }}/200 ký tự</span>
            <span v-if="errors.title" class="form-error">{{ errors.title }}</span>
          </div>

          <!-- Subtitle -->
          <div class="form-group">
            <label for="course-subtitle" class="form-label">Mô tả ngắn</label>
            <input
              id="course-subtitle"
              v-model="formData.subtitle"
              type="text"
              class="form-input"
              placeholder="Mô tả ngắn về khóa học (hiển thị trên thẻ khóa học)"
              maxlength="300"
            />
            <span class="form-help">{{ formData.subtitle.length }}/300 ký tự</span>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="course-description" class="form-label required">Mô tả chi tiết</label>
            <textarea
              id="course-description"
              v-model="formData.description"
              class="form-textarea"
              :class="{ error: errors.description }"
              rows="6"
              placeholder="Mô tả chi tiết về khóa học, nội dung sẽ học, mục tiêu..."
              minlength="50"
              maxlength="5000"
              required
            ></textarea>
            <span class="form-help">{{ formData.description.length }}/5000 ký tự (tối thiểu 50)</span>
            <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
          </div>

          <!-- Category & Level -->
          <div class="form-row">
            <div class="form-group">
              <label for="course-category" class="form-label required">Chủ đề</label>
              <select
                id="course-category"
                v-model="formData.category"
                class="form-select"
                :class="{ error: errors.category }"
                required
              >
                <option value="">Chọn chủ đề</option>
                <option value="programming">Lập trình</option>
                <option value="design">Thiết kế</option>
                <option value="business">Kinh doanh</option>
                <option value="language">Ngoại ngữ</option>
                <option value="marketing">Marketing</option>
                <option value="science">Khoa học</option>
                <option value="other">Khác</option>
              </select>
              <span v-if="errors.category" class="form-error">{{ errors.category }}</span>
            </div>

            <div class="form-group">
              <label for="course-level" class="form-label required">Cấp độ</label>
              <select
                id="course-level"
                v-model="formData.level"
                class="form-select"
                :class="{ error: errors.level }"
                required
              >
                <option value="">Chọn cấp độ</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
                <option value="expert">Chuyên gia</option>
              </select>
              <span v-if="errors.level" class="form-error">{{ errors.level }}</span>
            </div>
          </div>

          <!-- Pricing -->
          <div class="form-group">
            <label class="form-label required">Giá khóa học</label>
            <div class="pricing-options">
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.pricing.isFree"
                  :value="true"
                  class="radio-input"
                />
                <span>Miễn phí</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  v-model="formData.pricing.isFree"
                  :value="false"
                  class="radio-input"
                />
                <span>Có phí</span>
              </label>
            </div>
            <div v-if="!formData.pricing.isFree" class="form-row" style="margin-top: 1rem;">
              <div class="form-group">
                <label for="course-price" class="form-label">Giá (VNĐ)</label>
                <input
                  id="course-price"
                  v-model.number="formData.pricing.price"
                  type="number"
                  class="form-input"
                  min="0"
                  placeholder="0"
                />
              </div>
              <div class="form-group">
                <label for="course-original-price" class="form-label">Giá gốc (VNĐ)</label>
                <input
                  id="course-original-price"
                  v-model.number="formData.pricing.originalPrice"
                  type="number"
                  class="form-input"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label for="course-tags" class="form-label">Thẻ (Tags)</label>
            <input
              id="course-tags"
              v-model="tagInput"
              type="text"
              class="form-input"
              placeholder="Nhập thẻ và nhấn Enter (ví dụ: React, JavaScript, Web Development)"
              @keydown.enter.prevent="addTag"
            />
            <div v-if="formData.tags.length > 0" class="tags-list">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="tag-item"
              >
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="tag-remove">×</button>
              </span>
            </div>
          </div>

          <!-- What You Will Learn -->
          <div class="form-group">
            <label for="learn-items" class="form-label">Bạn sẽ học được gì?</label>
            <div class="list-input">
              <input
                id="learn-items"
                v-model="learnInput"
                type="text"
                class="form-input"
                placeholder="Nhập mục tiêu học tập và nhấn Enter"
                @keydown.enter.prevent="addLearnItem"
              />
              <ul v-if="formData.whatYouWillLearn.length > 0" class="list-items">
                <li
                  v-for="(item, index) in formData.whatYouWillLearn"
                  :key="index"
                  class="list-item"
                >
                  {{ item }}
                  <button type="button" @click="removeLearnItem(index)" class="item-remove">×</button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Requirements -->
          <div class="form-group">
            <label for="requirements" class="form-label">Yêu cầu</label>
            <div class="list-input">
              <input
                id="requirements"
                v-model="requirementInput"
                type="text"
                class="form-input"
                placeholder="Nhập yêu cầu và nhấn Enter"
                @keydown.enter.prevent="addRequirement"
              />
              <ul v-if="formData.requirements.length > 0" class="list-items">
                <li
                  v-for="(item, index) in formData.requirements"
                  :key="index"
                  class="list-item"
                >
                  {{ item }}
                  <button type="button" @click="removeRequirement(index)" class="item-remove">×</button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Navigation -->
          <div class="form-actions">
            <router-link to="/courses" class="btn btn-secondary">Hủy</router-link>
            <button type="button" @click="nextStep" class="btn btn-primary">Tiếp theo</button>
          </div>
        </div>

        <!-- Step 2: Course Content (Modules & Lessons) -->
        <div v-if="currentStep === 2" class="form-step">
          <h2 class="step-title">Nội dung khóa học</h2>
          <p class="step-description">Tạo các module và bài học cho khóa học của bạn</p>

          <!-- Modules List -->
          <div class="modules-section">
            <div
              v-for="(module, moduleIndex) in formData.modules"
              :key="moduleIndex"
              class="module-card"
            >
              <div class="module-header">
                <h3 class="module-title">Module {{ moduleIndex + 1 }}: {{ module.title || 'Chưa có tiêu đề' }}</h3>
                <button
                  type="button"
                  @click="removeModule(moduleIndex)"
                  class="btn-remove-module"
                  v-if="formData.modules.length > 1"
                >
                  Xóa module
                </button>
              </div>

              <div class="module-content">
                <!-- Module Title -->
                <div class="form-group">
                  <label :for="`module-title-${moduleIndex}`" class="form-label required">Tên module</label>
                  <input
                    :id="`module-title-${moduleIndex}`"
                    v-model="module.title"
                    type="text"
                    class="form-input"
                    placeholder="Ví dụ: Giới thiệu về React"
                    required
                  />
                </div>

                <!-- Module Description -->
                <div class="form-group">
                  <label :for="`module-desc-${moduleIndex}`" class="form-label">Mô tả module</label>
                  <textarea
                    :id="`module-desc-${moduleIndex}`"
                    v-model="module.description"
                    class="form-textarea"
                    rows="2"
                    placeholder="Mô tả ngắn về module này"
                  ></textarea>
                </div>

                <!-- Lessons in Module -->
                <div class="lessons-section">
                  <div class="lessons-header">
                    <h4>Bài học trong module</h4>
                    <button
                      type="button"
                      @click="addLesson(moduleIndex)"
                      class="btn-add-lesson"
                    >
                      + Thêm bài học
                    </button>
                  </div>

                  <div
                    v-for="(lesson, lessonIndex) in module.lessons"
                    :key="lessonIndex"
                    class="lesson-card"
                  >
                    <div class="lesson-header">
                      <span class="lesson-number">Bài {{ lessonIndex + 1 }}</span>
                      <button
                        type="button"
                        @click="removeLesson(moduleIndex, lessonIndex)"
                        class="btn-remove-lesson"
                        v-if="module.lessons.length > 1"
                      >
                        ×
                      </button>
                    </div>

                    <div class="lesson-content">
                      <div class="form-group">
                        <label :for="`lesson-title-${moduleIndex}-${lessonIndex}`" class="form-label required">Tên bài học</label>
                        <input
                          :id="`lesson-title-${moduleIndex}-${lessonIndex}`"
                          v-model="lesson.title"
                          type="text"
                          class="form-input"
                          placeholder="Ví dụ: Giới thiệu về Components"
                          required
                        />
                      </div>

                      <div class="form-group">
                        <label :for="`lesson-desc-${moduleIndex}-${lessonIndex}`" class="form-label">Mô tả</label>
                        <textarea
                          :id="`lesson-desc-${moduleIndex}-${lessonIndex}`"
                          v-model="lesson.description"
                          class="form-textarea"
                          rows="2"
                          placeholder="Mô tả bài học"
                        ></textarea>
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label :for="`lesson-duration-${moduleIndex}-${lessonIndex}`" class="form-label">Thời lượng (phút)</label>
                          <input
                            :id="`lesson-duration-${moduleIndex}-${lessonIndex}`"
                            v-model.number="lesson.duration"
                            type="number"
                            class="form-input"
                            min="0"
                            placeholder="0"
                          />
                        </div>

                        <div class="form-group">
                          <label class="form-label">
                            <input
                              type="checkbox"
                              v-model="lesson.isPreview"
                              class="checkbox-input"
                            />
                            Cho phép xem trước (Preview)
                          </label>
                        </div>
                      </div>

                      <!-- Video Upload -->
                      <div class="form-group">
                        <label class="form-label">Video bài học</label>
                        <div class="file-upload">
                          <input
                            type="file"
                            :ref="`video-${moduleIndex}-${lessonIndex}`"
                            accept="video/*"
                            @change="(e) => handleVideoChange(e, moduleIndex, lessonIndex)"
                            class="file-input"
                            :id="`video-upload-${moduleIndex}-${lessonIndex}`"
                          />
                          <label
                            :for="`video-upload-${moduleIndex}-${lessonIndex}`"
                            class="file-upload-label"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            {{ lesson.videoFile ? lesson.videoFile.name : 'Chọn file video' }}
                          </label>
                          <small>MP4, AVI, MOV (tối đa 500MB)</small>
                        </div>
                      </div>

                      <!-- Lesson Content (Text/HTML) -->
                      <div class="form-group">
                        <label :for="`lesson-content-${moduleIndex}-${lessonIndex}`" class="form-label">Nội dung bài học (HTML)</label>
                        <textarea
                          :id="`lesson-content-${moduleIndex}-${lessonIndex}`"
                          v-model="lesson.content"
                          class="form-textarea"
                          rows="4"
                          placeholder="Nội dung bài học (có thể dùng HTML)"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Module Button -->
            <button type="button" @click="addModule" class="btn-add-module">
              + Thêm module mới
            </button>
          </div>

          <!-- Navigation -->
          <div class="form-actions">
            <button type="button" @click="prevStep" class="btn btn-secondary">Quay lại</button>
            <button type="button" @click="nextStep" class="btn btn-primary">Tiếp theo</button>
          </div>
        </div>

        <!-- Step 3: Review & Submit -->
        <div v-if="currentStep === 3" class="form-step">
          <h2 class="step-title">Xem lại thông tin</h2>
          <p class="step-description">Kiểm tra lại thông tin trước khi xuất bản</p>

          <div class="review-section">
            <div class="review-card">
              <h3>Thông tin cơ bản</h3>
              <div class="review-item">
                <strong>Tên khóa học:</strong> {{ formData.title }}
              </div>
              <div class="review-item">
                <strong>Mô tả ngắn:</strong> {{ formData.subtitle || 'Chưa có' }}
              </div>
              <div class="review-item">
                <strong>Chủ đề:</strong> {{ getCategoryName(formData.category) }}
              </div>
              <div class="review-item">
                <strong>Cấp độ:</strong> {{ getLevelName(formData.level) }}
              </div>
              <div class="review-item">
                <strong>Giá:</strong> {{ formData.pricing.isFree ? 'Miễn phí' : formatPrice(formData.pricing.price) + ' VNĐ' }}
              </div>
            </div>

            <div class="review-card">
              <h3>Nội dung khóa học</h3>
              <div class="review-item">
                <strong>Số module:</strong> {{ formData.modules.length }}
              </div>
              <div class="review-item">
                <strong>Tổng số bài học:</strong> {{ totalLessons }}
              </div>
              <div class="review-item">
                <strong>Tổng thời lượng ước tính:</strong> {{ totalDuration }} phút
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="form-actions">
            <button type="button" @click="prevStep" class="btn btn-secondary">Quay lại</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting">Đang tải lên...</span>
              <span v-else>Xuất bản khóa học</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Success Message -->
      <div v-if="showSuccess" class="success-modal">
        <div class="success-content">
          <div class="success-icon">✅</div>
          <h2>Khóa học đã được tạo thành công!</h2>
          <p>Khóa học của bạn đã được lưu và sẽ hiển thị trên trang khóa học.</p>
          <div class="success-actions">
            <router-link :to="`/course/${createdCourseId}`" class="btn btn-primary">Xem khóa học</router-link>
            <router-link to="/courses/upload" class="btn btn-secondary" @click="resetForm">Tạo khóa học mới</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import bus from '@/utils/eventBus.js'

export default {
  name: 'UploadCourseView',
  setup() {
    const isLoggedIn = ref(false)
    const isInstructor = ref(false)
    const currentStep = ref(1)
    const submitting = ref(false)
    const showSuccess = ref(false)
    const createdCourseId = ref(null)
    const thumbnailInput = ref(null)
    const thumbnailPreview = ref(null)
    const thumbnailFile = ref(null)
    
    const tagInput = ref('')
    const learnInput = ref('')
    const requirementInput = ref('')

    const formData = ref({
      title: '',
      subtitle: '',
      description: '',
      category: '',
      level: '',
      thumbnail: null,
      pricing: {
        isFree: true,
        price: 0,
        originalPrice: 0
      },
      tags: [],
      whatYouWillLearn: [],
      requirements: [],
      modules: [
        {
          title: '',
          description: '',
          lessons: [
            {
              title: '',
              description: '',
              duration: 0,
              content: '',
              videoFile: null,
              isPreview: false
            }
          ]
        }
      ]
    })

    const errors = ref({})

    // Computed
    const totalLessons = computed(() => {
      return formData.value.modules.reduce((sum, module) => sum + module.lessons.length, 0)
    })

    const totalDuration = computed(() => {
      return formData.value.modules.reduce((sum, module) => {
        return sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0)
      }, 0)
    })

    // Methods
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const role = localStorage.getItem('userRole') || 'student'
      isLoggedIn.value = loggedIn
      isInstructor.value = role === 'instructor' || role === 'teacher' || role === 'giangvien'
    }

    const handleThumbnailChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('File ảnh không được vượt quá 5MB')
          return
        }
        thumbnailFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
          thumbnailPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const removeThumbnail = () => {
      thumbnailPreview.value = null
      thumbnailFile.value = null
      if (thumbnailInput.value) {
        thumbnailInput.value.value = ''
      }
    }

    const handleVideoChange = (e, moduleIndex, lessonIndex) => {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 500 * 1024 * 1024) {
          alert('File video không được vượt quá 500MB')
          return
        }
        formData.value.modules[moduleIndex].lessons[lessonIndex].videoFile = file
      }
    }

    const addTag = () => {
      if (tagInput.value.trim() && !formData.value.tags.includes(tagInput.value.trim())) {
        formData.value.tags.push(tagInput.value.trim())
        tagInput.value = ''
      }
    }

    const removeTag = (index) => {
      formData.value.tags.splice(index, 1)
    }

    const addLearnItem = () => {
      if (learnInput.value.trim() && !formData.value.whatYouWillLearn.includes(learnInput.value.trim())) {
        formData.value.whatYouWillLearn.push(learnInput.value.trim())
        learnInput.value = ''
      }
    }

    const removeLearnItem = (index) => {
      formData.value.whatYouWillLearn.splice(index, 1)
    }

    const addRequirement = () => {
      if (requirementInput.value.trim() && !formData.value.requirements.includes(requirementInput.value.trim())) {
        formData.value.requirements.push(requirementInput.value.trim())
        requirementInput.value = ''
      }
    }

    const removeRequirement = (index) => {
      formData.value.requirements.splice(index, 1)
    }

    const addModule = () => {
      formData.value.modules.push({
        title: '',
        description: '',
        lessons: [
          {
            title: '',
            description: '',
            duration: 0,
            content: '',
            videoFile: null,
            isPreview: false
          }
        ]
      })
    }

    const removeModule = (index) => {
      if (formData.value.modules.length > 1) {
        formData.value.modules.splice(index, 1)
      }
    }

    const addLesson = (moduleIndex) => {
      formData.value.modules[moduleIndex].lessons.push({
        title: '',
        description: '',
        duration: 0,
        content: '',
        videoFile: null,
        isPreview: false
      })
    }

    const removeLesson = (moduleIndex, lessonIndex) => {
      if (formData.value.modules[moduleIndex].lessons.length > 1) {
        formData.value.modules[moduleIndex].lessons.splice(lessonIndex, 1)
      }
    }

    const validateStep1 = () => {
      errors.value = {}
      if (!formData.value.title.trim()) {
        errors.value.title = 'Tên khóa học là bắt buộc'
      }
      if (!formData.value.description.trim() || formData.value.description.length < 50) {
        errors.value.description = 'Mô tả phải có ít nhất 50 ký tự'
      }
      if (!formData.value.category) {
        errors.value.category = 'Vui lòng chọn chủ đề'
      }
      if (!formData.value.level) {
        errors.value.level = 'Vui lòng chọn cấp độ'
      }
      return Object.keys(errors.value).length === 0
    }

    const nextStep = () => {
      if (currentStep.value === 1) {
        if (!validateStep1()) {
          return
        }
      }
      if (currentStep.value < 3) {
        currentStep.value++
      }
    }

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--
      }
    }

    const getCategoryName = (category) => {
      const names = {
        programming: 'Lập trình',
        design: 'Thiết kế',
        business: 'Kinh doanh',
        language: 'Ngoại ngữ',
        marketing: 'Marketing',
        science: 'Khoa học',
        other: 'Khác'
      }
      return names[category] || category
    }

    const getLevelName = (level) => {
      const names = {
        beginner: 'Cơ bản',
        intermediate: 'Trung cấp',
        advanced: 'Nâng cao',
        expert: 'Chuyên gia'
      }
      return names[level] || level
    }

    const formatPrice = (price) => {
      return price.toLocaleString('vi-VN')
    }

    const handleSubmit = async () => {
      submitting.value = true
      try {
        const userId = localStorage.getItem('userId') || localStorage.getItem('user_id')
        const userName = localStorage.getItem('userFullName') || 'Giảng viên'

        // Prepare FormData
        const formDataToSend = new FormData()

        // Add thumbnail
        if (thumbnailFile.value) {
          formDataToSend.append('thumbnail', thumbnailFile.value)
        }

        // Add course data
        formDataToSend.append('title', formData.value.title)
        formDataToSend.append('subtitle', formData.value.subtitle || '')
        formDataToSend.append('description', formData.value.description)
        formDataToSend.append('category', formData.value.category)
        formDataToSend.append('level', formData.value.level)
        formDataToSend.append('pricing', JSON.stringify(formData.value.pricing))
        formDataToSend.append('tags', JSON.stringify(formData.value.tags))
        formDataToSend.append('whatYouWillLearn', JSON.stringify(formData.value.whatYouWillLearn))
        formDataToSend.append('requirements', JSON.stringify(formData.value.requirements))
        formDataToSend.append('instructorId', userId)
        formDataToSend.append('instructorName', userName)

        // Process modules and lessons
        const modulesData = formData.value.modules.map((module, moduleIndex) => {
          const moduleLessons = module.lessons.map((lesson, lessonIndex) => {
            // Add video file if exists
            if (lesson.videoFile) {
              formDataToSend.append(`video_${moduleIndex}_${lessonIndex}`, lesson.videoFile)
            }

            return {
              title: lesson.title,
              description: lesson.description || '',
              duration: lesson.duration || 0,
              content: lesson.content || '',
              videoFileName: lesson.videoFile ? lesson.videoFile.name : '',
              isPreview: lesson.isPreview || false,
              order: lessonIndex + 1
            }
          })

          return {
            title: module.title,
            description: module.description || '',
            lessons: moduleLessons,
            order: moduleIndex + 1
          }
        })

        formDataToSend.append('modules', JSON.stringify(modulesData))

        // Calculate total duration and lessons count
        const totalDurationMinutes = totalDuration.value
        const totalHours = Math.ceil(totalDurationMinutes / 60)
        formDataToSend.append('duration', totalHours.toString())
        formDataToSend.append('lessonsCount', totalLessons.value.toString())

        // Send to API
        const response = await fetch('/api/courses', {
          method: 'POST',
          body: formDataToSend
        })

        // Check if response is ok before parsing JSON
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Server error response:', errorText)
          try {
            const errorJson = JSON.parse(errorText)
            alert(errorJson.message || `Lỗi ${response.status}: ${errorJson.error || 'Có lỗi xảy ra khi tạo khóa học'}`)
          } catch {
            alert(`Lỗi ${response.status}: ${errorText || 'Có lỗi xảy ra khi tạo khóa học'}`)
          }
          return
        }

        const result = await response.json()
        console.log('Create course response:', result)

        if (result.success) {
          createdCourseId.value = result.data.course_id || result.data.id
          showSuccess.value = true
        } else {
          console.error('Create course failed:', result)
          alert(result.message || 'Có lỗi xảy ra khi tạo khóa học')
        }
      } catch (error) {
        console.error('Error creating course:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
        alert('Có lỗi xảy ra khi tạo khóa học. Vui lòng kiểm tra console để xem chi tiết.')
      } finally {
        submitting.value = false
      }
    }

    const resetForm = () => {
      formData.value = {
        title: '',
        subtitle: '',
        description: '',
        category: '',
        level: '',
        thumbnail: null,
        pricing: {
          isFree: true,
          price: 0,
          originalPrice: 0
        },
        tags: [],
        whatYouWillLearn: [],
        requirements: [],
        modules: [
          {
            title: '',
            description: '',
            lessons: [
              {
                title: '',
                description: '',
                duration: 0,
                content: '',
                videoFile: null,
                isPreview: false
              }
            ]
          }
        ]
      }
      thumbnailPreview.value = null
      thumbnailFile.value = null
      currentStep.value = 1
      showSuccess.value = false
      createdCourseId.value = null
    }

    // Listen for login success to refresh auth
    const handleLoginSuccess = () => {
      checkAuth()
    }

    onMounted(() => {
      checkAuth()
      // Listen for login events to refresh role
      bus.on('login-success', handleLoginSuccess)
    })

    onUnmounted(() => {
      bus.off('login-success', handleLoginSuccess)
    })

    return {
      isLoggedIn,
      isInstructor,
      currentStep,
      submitting,
      showSuccess,
      createdCourseId,
      formData,
      errors,
      thumbnailInput,
      thumbnailPreview,
      tagInput,
      learnInput,
      requirementInput,
      totalLessons,
      totalDuration,
      handleThumbnailChange,
      removeThumbnail,
      handleVideoChange,
      addTag,
      removeTag,
      addLearnItem,
      removeLearnItem,
      addRequirement,
      removeRequirement,
      addModule,
      removeModule,
      addLesson,
      removeLesson,
      nextStep,
      prevStep,
      handleSubmit,
      resetForm,
      getCategoryName,
      getLevelName,
      formatPrice
    }
  }
}
</script>

<style scoped>
.upload-course-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 120px 20px 40px;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
}

.access-denied {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.denied-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.access-denied h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.access-denied p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-login,
.btn-back {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-login:hover,
.btn-back:hover {
  background: #059669;
}

.upload-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
}

.step.active .step-number {
  background: #10b981;
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.step.active .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-line {
  width: 100px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 1rem;
  transition: all 0.3s;
}

.step-line.completed {
  background: #10b981;
}

/* Form Styles */
.form-step {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.step-description {
  color: #6b7280;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-help {
  display: block;
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.form-error {
  display: block;
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Thumbnail Upload */
.thumbnail-upload {
  margin-top: 0.5rem;
}

.upload-placeholder {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-placeholder:hover {
  border-color: #10b981;
  background: #f0fdf4;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #6b7280;
}

.upload-label svg {
  color: #10b981;
}

.upload-label small {
  font-size: 0.875rem;
  color: #9ca3af;
}

.thumbnail-preview {
  position: relative;
  display: inline-block;
}

.thumbnail-preview img {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pricing Options */
.pricing-options {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Tags */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 0.875rem;
}

.tag-remove {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  width: 18px;
  height: 18px;
}

/* List Items */
.list-input {
  margin-top: 0.5rem;
}

.list-items {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.item-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
}

/* Modules & Lessons */
.modules-section {
  margin-top: 2rem;
}

.module-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid #e5e7eb;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.module-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.btn-remove-module {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.lessons-section {
  margin-top: 1.5rem;
}

.lessons-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lessons-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.btn-add-lesson {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.lesson-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lesson-number {
  font-weight: 600;
  color: #10b981;
}

.btn-remove-lesson {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-module {
  width: 100%;
  padding: 1rem;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-module:hover {
  border-color: #10b981;
  color: #10b981;
  background: #f0fdf4;
}

.file-upload {
  margin-top: 0.5rem;
}

.file-upload-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.file-upload-label:hover {
  background: #e5e7eb;
}

.file-upload-label svg {
  color: #10b981;
}

.file-upload small {
  display: block;
  margin-top: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 0.5rem;
}

/* Review Section */
.review-section {
  margin-top: 2rem;
}

.review-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.review-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.review-item {
  margin-bottom: 0.75rem;
  color: #374151;
}

.review-item strong {
  color: #1f2937;
  margin-right: 0.5rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  /* Reset defaults */
  margin: 0;
  padding: 0 2rem;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-sizing: border-box;
  
  /* Fixed height */
  height: 56px;
  min-height: 56px;
  max-height: 56px;
  
  /* Style */
  border-radius: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: #10b981;
  color: white;
  border-color: #10b981;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
  border-color: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #ffffff;
  color: #374151;
  border-color: #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Success Modal */
.success-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.success-content {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  margin: 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-content h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.success-content p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.success-actions .btn {
  flex: 1;
  min-width: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .step-indicator {
    flex-wrap: wrap;
  }

  .step-line {
    width: 50px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-actions .btn {
    width: 100%;
    min-width: auto;
  }
}
</style>

