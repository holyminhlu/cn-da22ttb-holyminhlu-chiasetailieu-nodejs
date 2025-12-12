<template>
  <header class="profile-hero" role="banner">
    <!-- Cover Image -->
    <div class="cover-container">
      <img
        v-if="coverUrl"
        :src="coverUrl"
        alt="Cover image"
        class="cover-image"
      />
      <div v-else class="cover-placeholder">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
      <button
        v-if="isOwner"
        class="cover-edit-btn"
        @click="$emit('upload-cover')"
        aria-label="Thay đổi ảnh bìa"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
        Thay đổi ảnh bìa
      </button>
    </div>

    <!-- Profile Info -->
    <div class="profile-info-container">
      <div class="container">
        <div class="profile-info">
          <!-- Avatar -->
          <div class="avatar-wrapper">
            <div class="avatar-container">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                :alt="displayName"
                class="avatar-image"
              />
              <div v-else class="avatar-placeholder">
                {{ displayName.charAt(0).toUpperCase() }}
              </div>
              <button
                v-if="isOwner"
                class="avatar-edit-btn"
                @click="$emit('upload-avatar')"
                aria-label="Thay ảnh đại diện"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Name and Info -->
          <div class="profile-details">
            <div class="name-row">
              <h1 class="display-name">{{ displayName }}</h1>
              <span v-if="verified" class="verified-badge" aria-label="Đã xác minh">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
            </div>
            <p class="username">@{{ username }}</p>
            <div class="meta-row">
              <span class="role-badge">{{ role }}</span>
              <span v-if="location" class="location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {{ location }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="profile-actions">
            <button
              v-if="isOwner"
              class="btn-edit"
              @click="$emit('edit-profile')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Chỉnh sửa hồ sơ
            </button>
            <template v-else>
              <button class="btn-follow" @click="$emit('follow')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Theo dõi
              </button>
              <button class="btn-message" @click="$emit('message')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Nhắn tin
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'ProfileHero',
  props: {
    coverUrl: {
      type: String,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    displayName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: ''
    },
    verified: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: ''
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit-profile', 'upload-avatar', 'upload-cover', 'follow', 'message']
}
</script>

<style scoped>
.profile-hero {
  position: relative;
  margin-bottom: 2rem;
}

.cover-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cover-edit-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  backdrop-filter: blur(8px);
}

.cover-edit-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.profile-info-container {
  background: white;
  border-bottom: 1px solid #E2E8F0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-info {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  padding: 2rem 0;
  position: relative;
}

.avatar-wrapper {
  margin-top: -60px;
  position: relative;
  z-index: 1;
}

.avatar-container {
  position: relative;
}

.avatar-image,
.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: #0B6EFD;
  border: 3px solid white;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.avatar-edit-btn:hover {
  background: #0956D9;
}

.profile-details {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.display-name {
  font-size: 2rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.verified-badge {
  display: flex;
  align-items: center;
  color: #10B981;
  flex-shrink: 0;
}

.username {
  font-size: 1rem;
  color: #64748B;
  margin: 0 0 0.75rem 0;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.role-badge {
  padding: 0.375rem 0.75rem;
  background: #F1F5F9;
  color: #0B6EFD;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #64748B;
  font-size: 0.875rem;
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn-edit,
.btn-follow,
.btn-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-edit {
  background: #0B6EFD;
  color: white;
}

.btn-edit:hover {
  background: #0956D9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(11, 110, 253, 0.3);
}

.btn-follow {
  background: white;
  color: #0B6EFD;
  border: 2px solid #0B6EFD;
}

.btn-follow:hover {
  background: #0B6EFD;
  color: white;
}

.btn-message {
  background: #F1F5F9;
  color: #0F172A;
  border: 2px solid #E2E8F0;
}

.btn-message:hover {
  background: #E2E8F0;
}

/* Responsive */
@media (max-width: 959px) {
  .profile-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .avatar-wrapper {
    margin-top: -40px;
  }

  .avatar-image,
  .avatar-placeholder {
    width: 96px;
    height: 96px;
  }

  .display-name {
    font-size: 1.5rem;
  }

  .profile-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-edit,
  .btn-follow,
  .btn-message {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 599px) {
  .cover-container {
    height: 200px;
  }

  .avatar-image,
  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }

  .display-name {
    font-size: 1.25rem;
  }
}
</style>












