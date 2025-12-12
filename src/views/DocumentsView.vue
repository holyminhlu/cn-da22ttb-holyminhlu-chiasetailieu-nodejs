<template>
  <main class="documents-page" role="main">
    <!-- Skip Link for Accessibility -->
    <a href="#main-content" class="skip-link">Bỏ qua đến nội dung chính</a>

    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol class="breadcrumbs-list">
        <li class="breadcrumb-item">
        <!-- <router-link to="/" class="breadcrumb-link">Trang chủ</router-link>--> 
        </li>
 <!--       <li class="breadcrumb-separator" aria-hidden="true">/</li>--> 
        <!--<li class="breadcrumb-item">
          <span class="breadcrumb-current" aria-current="page">Tài liệu</span> 
        </li>-->
        <li v-if="activeCategory" class="breadcrumb-separator" aria-hidden="true">/</li>
        <li v-if="activeCategory" class="breadcrumb-item">
          <span class="breadcrumb-current" aria-current="page">{{ activeCategory }}</span>
        </li>
      </ol>
    </nav>

    <!-- Header Region -->
    <header class="page-header" id="main-content">
      <div class="header-content">
        <h1 class="page-title">📚 Thư Viện Tài Liệu</h1>
        <p class="page-subtitle">
          Khám phá hàng ngàn tài liệu chất lượng cao từ mọi lĩnh vực. 
        </p>

        <!-- Search Bar -->
        <div class="search-section">
          <SearchBar
            v-model="searchQuery"
            placeholder="Tìm theo môn, mã học phần, tên tác giả..."
            @search="handleSearch"
          />
        </div>

        <!-- Upload CTA & User Auth -->
        <div class="header-actions">
          <button
            class="upload-cta"
            type="button"
            aria-label="Tải lên tài liệu"
            @click="showUploadModal = true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Tải lên tài liệu
          </button>
          <div v-if="isLoggedIn" class="user-info">
            <span class="user-name">{{ userName }}</span>
        </div>
          <router-link v-else to="/signin" class="sign-in-link">
            Đăng nhập
          </router-link>
        </div>
        </div>
    </header>

    <div class="page-layout">
      <!-- Sidebar (Desktop) -->
      <aside class="sidebar" role="complementary" aria-label="Sidebar">
        <!-- Featured Collections -->
        <section class="sidebar-section">
          <h2 class="sidebar-title">Bộ sưu tập nổi bật</h2>
          <ul class="collections-list" role="list">
            <li
              v-for="collection in featuredCollections"
              :key="collection.id"
              class="collection-item"
              role="listitem"
            >
              <button
                class="collection-link"
                type="button"
                @click="filterByCollection(collection)"
              >
                <span class="collection-icon">{{ collection.icon }}</span>
                <div class="collection-info">
                  <span class="collection-title">{{ collection.title }}</span>
                  <span class="collection-count">{{ collection.count }} tài liệu</span>
    </div>
              </button>
            </li>
          </ul>
        </section>

        <!-- Top Authors -->
        <section class="sidebar-section">
          <h2 class="sidebar-title">Tác giả hàng đầu</h2>
          <ul class="authors-list" role="list">
            <li
              v-for="author in topAuthors"
              :key="author.id"
              class="author-item"
              role="listitem"
            >
              <div class="author-info">
                <img
                  v-if="author.avatar"
                  :src="author.avatar"
                  :alt="`Avatar của ${author.name}`"
                  class="author-avatar"
                />
                <div class="author-details">
                  <span class="author-name">{{ author.name }}</span>
                  <span class="author-count">{{ author.documentsCount }} tài liệu</span>
          </div>
          </div>
            </li>
          </ul>
        </section>

        <!-- Quick Tags -->
        <section class="sidebar-section">
          <h2 class="sidebar-title">Thẻ phổ biến</h2>
          <div class="quick-tags">
            <button
              v-for="tag in quickTags"
              :key="tag"
              class="quick-tag"
              type="button"
              @click="addTagFilter(tag)"
            >
              {{ tag }}
            </button>
        </div>
        </section>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Filter Panel -->
        <FilterPanel
          v-model:filters="activeFilters"
          :programs="programs"
          :categories="categories"
          :available-tags="availableTags"
          @update:filters="handleFilterChange"
        />

        <!-- Active Filter Chips -->
        <div v-if="hasActiveFilters" class="active-filters" role="group" aria-label="Bộ lọc đang áp dụng">
          <span
            v-for="(value, key) in activeFilterChips"
            :key="key"
            class="filter-chip"
          >
            <span class="chip-label">{{ getFilterLabel(key) }}:</span>
            <span class="chip-value">{{ value }}</span>
            <button
              class="chip-remove"
              type="button"
              :aria-label="`Xóa bộ lọc ${getFilterLabel(key)}`"
              @click="removeFilter(key)"
            >
              ×
            </button>
            </span>
          <button
            class="clear-all-chips"
            type="button"
            @click="clearAllFilters"
          >
            Xóa tất cả
          </button>
          </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container" role="status" aria-live="polite">
          <div class="skeleton-loader"></div>
          <div class="skeleton-loader"></div>
          <div class="skeleton-loader"></div>
          <p class="loading-text">Đang tải tài liệu...</p>
          </div>

        <!-- Empty State -->
        <div v-else-if="filteredDocuments.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3 class="empty-title">Không tìm thấy kết quả</h3>
          <p class="empty-message">
            Không tìm thấy kết quả. Thử bỏ bớt bộ lọc hoặc kiểm tra chính tả.
          </p>
          <div v-if="hasActiveFilters" class="empty-actions">
            <button class="btn btn-secondary" type="button" @click="clearAllFilters">
              Xóa tất cả bộ lọc
          </button>
        </div>
      </div>

        <!-- Documents Grid -->
        <div v-else class="documents-grid" role="list" aria-label="Danh sách tài liệu">
          <article
            v-for="doc in displayDocuments"
            :key="doc.id"
            class="document-card-wrapper"
            role="listitem"
          >
            <DocumentCard
              :document="formatDocumentForCard(doc)"
              @preview="handlePreview"
              @download="handleDownload"
              @save="handleSave"
            />
          </article>
    </div>

        <!-- Load More / Pagination -->
        <div v-if="!loading && filteredDocuments.length > 0" class="pagination-section">
          <button
            v-if="hasMore && useInfiniteScroll"
            class="load-more-btn"
            type="button"
            @click="loadMore"
          >
            Tải thêm
          </button>
          <div v-else-if="!useInfiniteScroll" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
              aria-label="Trang trước"
        @click="changePage(currentPage - 1)"
      >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
      </button>
      
      <button
        v-for="page in displayPages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
              :aria-label="`Trang ${page}`"
              :aria-current="page === currentPage ? 'page' : null"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
      
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
              aria-label="Trang sau"
        @click="changePage(currentPage + 1)"
      >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
      </button>
    </div>
  </div>

        <!-- Result Count -->
        <div v-if="!loading" class="result-count" role="status">
          Hiển thị {{ displayDocuments.length }} / {{ filteredDocuments.length }} kết quả
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <PreviewModal
      :is-open="previewModalOpen"
      :document="selectedDocument"
      @close="previewModalOpen = false"
      @download="handleDownload"
      @report="handleReport"
    />

    <!-- Upload Modal -->
    <UploadModal
      :is-open="showUploadModal"
      :programs="programs"
      @close="showUploadModal = false"
      @upload-success="handleUploadSuccess"
    />
  </main>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bus from '@/utils/eventBus.js'
import DocumentCard from '../components/DocumentCard.vue'
import SearchBar from '../components/SearchBar.vue'
import FilterPanel from '../components/FilterPanel.vue'
import PreviewModal from '../components/PreviewModal.vue'
import UploadModal from '../components/UploadModal.vue'
import documentsData from '../data/documentsData.json'

export default {
  name: 'DocumentsView',
  components: {
    DocumentCard,
    SearchBar,
    FilterPanel,
    PreviewModal,
    UploadModal
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // State
    const loading = ref(true)
    const documents = ref([])
    const searchQuery = ref('')
    const activeFilters = ref({
      category: '',
      program: '',
      year: '',
      fileType: '',
      level: '',
      language: '',
      tags: [],
      minRating: 0,
      sortBy: 'relevance'
    })
    const previewModalOpen = ref(false)
    const selectedDocument = ref(null)
    const showUploadModal = ref(false)
    const currentPage = ref(1)
    const documentsPerPage = 12
    const useInfiniteScroll = ref(true) // Can be configured

    // Data
    const programs = ref(documentsData.programs || [])
    const categories = ref(documentsData.categories || [])
    const featuredCollections = ref(documentsData.featuredCollections || [])
    const topAuthors = ref(documentsData.topAuthors || [])
    const quickTags = ref(documentsData.quickTags || [])
    const availableTags = computed(() => {
      const tagSet = new Set(quickTags.value || [])
      documents.value.forEach(doc => {
        (doc.tags || []).forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet)
    })

    const API_FETCH_LIMIT = 120

    const getEnvValue = (key, fallback = undefined) => {
      if (typeof import.meta !== 'undefined' && import.meta.env && Object.prototype.hasOwnProperty.call(import.meta.env, key)) {
        return import.meta.env[key]
      }
      if (typeof process !== 'undefined' && process.env && Object.prototype.hasOwnProperty.call(process.env, key)) {
        return process.env[key]
      }
      return fallback
    }

    const FILE_BASE_URL = getEnvValue('VITE_FILE_BASE_URL', 'http://localhost:3003')
    const STATIC_ASSET_PREFIXES = ['/img/', '/icons/', '/files/', '/assets/']

    const isExternalAsset = (url = '') => /^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')
    const shouldKeepRelativeAsset = (url = '') => STATIC_ASSET_PREFIXES.some(prefix => url.startsWith(prefix))

    const buildAssetUrl = (url) => {
      if (!url || typeof url !== 'string') return ''
      if (isExternalAsset(url) || shouldKeepRelativeAsset(url)) {
        return url
      }
      if (!url.startsWith('/')) {
        return url
      }
      return `${FILE_BASE_URL}${url}`
    }

    const normalizeTags = (tags) => {
      if (Array.isArray(tags)) {
        return tags.filter(Boolean)
      }
      if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }
      return []
    }

    const normalizeAuthors = (doc) => {
      if (Array.isArray(doc.authors) && doc.authors.length > 0) {
        return doc.authors
      }
      if (doc.author) {
        if (Array.isArray(doc.author)) {
          return doc.author
        }
        if (typeof doc.author === 'object' && doc.author.name) {
          return [doc.author.name]
        }
        return [doc.author]
      }
      return []
    }

    const normalizeLanguages = (doc) => {
      if (Array.isArray(doc.languages) && doc.languages.length > 0) {
        return doc.languages
      }
      if (doc.language) {
        return [doc.language]
      }
      return []
    }

    const findProgramByLabel = (label) => {
      if (!label) return null
      return programs.value.find(p => p.label?.toLowerCase() === label.toLowerCase()) || null
    }

    const findProgramById = (id) => {
      if (!id) return null
      return programs.value.find(p => p.id === id) || null
    }

    const findCategoryByLabel = (label) => {
      if (!label) return null
      return categories.value.find(c => c.label?.toLowerCase() === label.toLowerCase()) || null
    }

    const findCategoryById = (id) => {
      if (!id) return null
      return categories.value.find(c => c.id === id) || null
    }

    const normalizeDocumentRecord = (doc = {}) => {
      const normalizedAuthors = normalizeAuthors(doc)
      const languages = normalizeLanguages(doc)
      const language = languages[0] || 'vi'

      let programId = doc.programId || doc.program_id || ''
      let program = doc.program || doc.programName || ''
      if (!programId && program) {
        programId = findProgramByLabel(program)?.id || ''
      }
      if (!program && programId) {
        program = findProgramById(programId)?.label || programId
      }

      let categoryId = doc.categoryId || doc.category_id || ''
      let category = doc.category || doc.categoryName || ''
      if (!categoryId && category) {
        categoryId = findCategoryByLabel(category)?.id || ''
      }
      if (!category && categoryId) {
        category = findCategoryById(categoryId)?.label || categoryId
      }

      const rawFile = typeof doc.file === 'object' && doc.file !== null ? doc.file : null
      const resolvedFileUrl = buildAssetUrl(
        doc.fileUrl ||
        rawFile?.fileUrl ||
        (typeof doc.file === 'string' ? doc.file : '')
      )
      const resolvedThumbnail = buildAssetUrl(
        doc.thumbnail ||
        doc.coverImage ||
        doc.thumbnailUrl ||
        ''
      )

      return {
        id: doc.id || doc._id || doc.document_id,
        document_id: doc.document_id || doc.id || doc._id,
        title: doc.title || 'Tài liệu chưa có tiêu đề',
        description: doc.description || '',
        thumbnail: resolvedThumbnail,
        authors: normalizedAuthors,
        author: doc.author || (normalizedAuthors[0] || null),
        program,
        programId,
        category,
        categoryId,
        courseCode: doc.courseCode || '',
        year: doc.year ? parseInt(doc.year, 10) : '',
        tags: normalizeTags(doc.tags),
        downloads: Number(doc.downloads || doc.downloadCount || 0),
        views: Number(doc.views || doc.viewCount || 0),
        rating: Number(doc.rating || 0),
        ratingCount: Number(doc.ratingCount || 0),
        fileType: (rawFile?.fileType || doc.fileType || '').toString(),
        file: rawFile,
        fileUrl: resolvedFileUrl,
        license: doc.license || '',
        level: doc.level || '',
        language,
        languages,
        uploadDate: doc.uploadDate || doc.createdAt || new Date().toISOString()
      }
    }

    const normalizeDocuments = (docs = []) => docs.map(doc => normalizeDocumentRecord(doc))

    const compareInsensitive = (a, b) => {
      if (!a || !b) return false
      return a.toString().toLowerCase() === b.toString().toLowerCase()
    }

    // Auth
    const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
    const userName = ref(localStorage.getItem('userFullName') || 'Người dùng')

    // Computed
    const activeCategory = computed(() => {
      if (activeFilters.value.category) {
        const cat = categories.value.find(c => c.id === activeFilters.value.category)
        return cat ? cat.label : ''
      }
      return ''
    })

    const filteredDocuments = computed(() => {
      let result = [...documents.value]

      // Search filter
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(doc => {
          return (
            doc.title.toLowerCase().includes(query) ||
            (doc.authors && doc.authors.some(a => a.toLowerCase().includes(query))) ||
            (doc.courseCode && doc.courseCode.toLowerCase().includes(query)) ||
            (doc.tags && doc.tags.some(t => t.toLowerCase().includes(query)))
          )
        })
      }

      // Category filter
      if (activeFilters.value.category) {
        const selectedCategory = activeFilters.value.category
        const categoryLabel = categories.value.find(c => c.id === selectedCategory)?.label
        result = result.filter(doc => {
          return doc.categoryId === selectedCategory ||
            doc.category === selectedCategory ||
            (categoryLabel && compareInsensitive(doc.category, categoryLabel))
        })
      }

      // Program filter
      if (activeFilters.value.program) {
        const selectedProgram = activeFilters.value.program
        const programLabel = programs.value.find(p => p.id === selectedProgram)?.label
        result = result.filter(doc => {
          return doc.programId === selectedProgram ||
            doc.program === selectedProgram ||
            (programLabel && compareInsensitive(doc.program, programLabel))
        })
      }

      // Year filter
      if (activeFilters.value.year) {
        const selectedYear = parseInt(activeFilters.value.year, 10)
        result = result.filter(doc => parseInt(doc.year, 10) === selectedYear)
      }

      // File type filter
      if (activeFilters.value.fileType) {
        const selectedFileType = activeFilters.value.fileType.toLowerCase()
        result = result.filter(doc => doc.fileType?.toLowerCase() === selectedFileType)
      }

      // Level filter
      if (activeFilters.value.level) {
        const selectedLevel = activeFilters.value.level.toLowerCase()
        result = result.filter(doc => doc.level?.toLowerCase() === selectedLevel)
      }

      // Language filter
      if (activeFilters.value.language) {
        const selectedLanguage = activeFilters.value.language.toLowerCase()
        result = result.filter(doc => {
          const docLanguages = doc.languages && doc.languages.length > 0
            ? doc.languages
            : doc.language
              ? [doc.language]
              : []
          return docLanguages.some(lang => compareInsensitive(lang, selectedLanguage))
        })
      }

      // Tags filter
      if (activeFilters.value.tags.length > 0) {
        const filterTags = activeFilters.value.tags.map(tag => tag.toLowerCase())
        result = result.filter(doc => {
          const docTags = (doc.tags || []).map(tag => tag.toLowerCase())
          return filterTags.some(tag => docTags.includes(tag))
        })
      }

      // Rating filter
      if (activeFilters.value.minRating > 0) {
        const minRating = Number(activeFilters.value.minRating)
        result = result.filter(doc => Number(doc.rating || 0) >= minRating)
      }

      // Sort
      switch (activeFilters.value.sortBy) {
        case 'newest':
          result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
          break
        case 'downloads':
          result.sort((a, b) => b.downloads - a.downloads)
          break
        case 'rating':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'relevance':
        default:
          // Relevance: prioritize search matches, then rating
          if (searchQuery.value.trim()) {
            result.sort((a, b) => {
              const aScore = calculateRelevanceScore(a)
              const bScore = calculateRelevanceScore(b)
              return bScore - aScore
            })
          } else {
            result.sort((a, b) => b.rating - a.rating)
          }
          break
      }

      return result
    })

    const hasActiveFilters = computed(() => {
      return activeFilters.value.category !== '' ||
             activeFilters.value.program !== '' ||
             activeFilters.value.year !== '' ||
             activeFilters.value.fileType !== '' ||
             activeFilters.value.level !== '' ||
             activeFilters.value.language !== '' ||
             activeFilters.value.tags.length > 0 ||
             activeFilters.value.minRating > 0 ||
             activeFilters.value.sortBy !== 'relevance'
    })

    const activeFilterChips = computed(() => {
      const chips = {}
      if (activeFilters.value.category) {
        const cat = categories.value.find(c => c.id === activeFilters.value.category)
        if (cat) chips.category = cat.label
      }
      if (activeFilters.value.program) {
        const prog = programs.value.find(p => p.id === activeFilters.value.program)
        if (prog) chips.program = prog.label
      }
      if (activeFilters.value.year) chips.year = activeFilters.value.year
      if (activeFilters.value.fileType) {
        chips.fileType = activeFilters.value.fileType.toUpperCase()
      }
      if (activeFilters.value.level) {
        chips.level = activeFilters.value.level === 'basic' ? 'Cơ bản' : 'Nâng cao'
      }
      if (activeFilters.value.language) {
        chips.language = activeFilters.value.language === 'vi' ? 'Tiếng Việt' : 'English'
      }
      activeFilters.value.tags.forEach(tag => {
        chips[`tag-${tag}`] = tag
      })
      if (activeFilters.value.minRating > 0) {
        chips.rating = `${activeFilters.value.minRating.toFixed(1)}+ ⭐`
      }
      return chips
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredDocuments.value.length / documentsPerPage)
    })

    const displayPages = computed(() => {
      const pages = []
      const maxPages = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
      let end = Math.min(totalPages.value, start + maxPages - 1)

      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const hasMore = computed(() => {
      if (!useInfiniteScroll.value) return false
      return displayDocuments.value.length < filteredDocuments.value.length
    })

    const displayDocuments = computed(() => {
      if (useInfiniteScroll.value) {
        // Infinite scroll mode
        const maxItems = currentPage.value * documentsPerPage
        return filteredDocuments.value.slice(0, maxItems)
      } else {
        // Pagination mode
        const start = (currentPage.value - 1) * documentsPerPage
        return filteredDocuments.value.slice(start, start + documentsPerPage)
      }
    })

    // Methods
    const fetchDocuments = async () => {
      loading.value = true
      try {
        console.log('📥 Fetching documents from API...')
        
        // Build query parameters
        const params = new URLSearchParams()
        if (searchQuery.value.trim()) {
          params.append('q', searchQuery.value.trim())
        }
        if (activeFilters.value.program) {
          params.append('program', activeFilters.value.program)
        }
        if (activeFilters.value.year) {
          params.append('year', activeFilters.value.year)
        }
        if (activeFilters.value.fileType) {
          params.append('fileType', activeFilters.value.fileType.toLowerCase())
        }
        if (activeFilters.value.language) {
          params.append('language', activeFilters.value.language)
        }
        if (activeFilters.value.tags.length > 0) {
          params.append('tags', activeFilters.value.tags.join(','))
        }
        params.append('page', '1')
        params.append('limit', API_FETCH_LIMIT)
        params.append('sortBy', activeFilters.value.sortBy)
        
        const queryString = params.toString()
        const url = queryString 
          ? `/api/documents/search?${queryString}`
          : `/api/documents?page=1&limit=${API_FETCH_LIMIT}&sortBy=${activeFilters.value.sortBy}`
        
        console.log('🔗 Request URL:', url)
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('✅ Documents fetched:', result.data?.length || 0)
        
        if (result.success && Array.isArray(result.data)) {
          documents.value = normalizeDocuments(result.data)
        } else {
          console.warn('⚠️ API response not successful, using mock data')
          documents.value = normalizeDocuments(documentsData.documents || [])
        }
      } catch (error) {
        console.error('❌ Error fetching documents:', error)
        // Fallback to mock data on error
        console.warn('⚠️ Using mock data due to error')
        documents.value = normalizeDocuments(documentsData.documents || [])
        
        // Show error toast if available
        if (window.$toast) {
          window.$toast.error('Không thể tải danh sách tài liệu. Đang sử dụng dữ liệu mẫu.')
        }
      } finally {
        loading.value = false
      }
    }

    const calculateRelevanceScore = (doc) => {
      if (!searchQuery.value.trim()) return doc.rating

      const query = searchQuery.value.toLowerCase()
      let score = doc.rating || 0

      // Title match (highest weight)
      if (doc.title.toLowerCase().includes(query)) {
        score += 10
      }

      // Author match
      if (doc.authors && doc.authors.some(a => a.toLowerCase().includes(query))) {
        score += 5
      }

      // Tag match
      if (doc.tags && doc.tags.some(t => t.toLowerCase().includes(query))) {
        score += 3
      }

      return score
    }

    const formatDocumentForCard = (doc) => {
      const resolvedFileUrl = (() => {
        if (doc.fileUrl) return doc.fileUrl
        if (typeof doc.file === 'string') return doc.file
        if (doc.file && doc.file.fileUrl) return doc.file.fileUrl
        return ''
      })()

      return {
        id: doc.id,
        document_id: doc.document_id || doc.id, // Add document_id for bookmark API
        title: doc.title,
        thumbnail: doc.thumbnail,
        author: doc.authors && doc.authors.length > 0 ? doc.authors.join(', ') : 'N/A',
        authors: doc.authors,
        program: doc.program,
        tags: doc.tags || [],
        downloads: doc.downloads || 0,
        rating: doc.rating || 0,
        year: doc.year,
        fileType: doc.fileType?.toUpperCase() || 'PDF',
        license: doc.license,
        file: doc.file,
        fileUrl: resolvedFileUrl,
        uploadDate: doc.uploadDate
      }
    }

    const handleSearch = (query) => {
      searchQuery.value = query
      currentPage.value = 1
      updateURL()
    }

    const handleFilterChange = () => {
      currentPage.value = 1
      updateURL()
    }

    const removeFilter = (key) => {
      if (key.startsWith('tag-')) {
        const tag = key.replace('tag-', '')
        const index = activeFilters.value.tags.indexOf(tag)
        if (index > -1) {
          activeFilters.value.tags.splice(index, 1)
        }
      } else {
        activeFilters.value[key] = key === 'tags' ? [] : key === 'minRating' ? 0 : ''
      }
      if (key === 'sortBy') {
        activeFilters.value.sortBy = 'relevance'
      }
      handleFilterChange()
    }

    const clearAllFilters = () => {
      activeFilters.value = {
        category: '',
        program: '',
        year: '',
        fileType: '',
        level: '',
        language: '',
        tags: [],
        minRating: 0,
        sortBy: 'relevance'
      }
      searchQuery.value = ''
      currentPage.value = 1
      updateURL()
    }

    const addTagFilter = (tag) => {
      if (!activeFilters.value.tags.includes(tag)) {
        activeFilters.value.tags.push(tag)
        handleFilterChange()
      }
    }

    // eslint-disable-next-line no-unused-vars
    const filterByCollection = (_collection) => {
      // Implementation depends on collection structure
      // For now, just clear and show a message
      clearAllFilters()
    }

    const getFilterLabel = (key) => {
      const labels = {
        category: 'Chuyên ngành',
        program: 'Chương trình',
        year: 'Năm',
        fileType: 'Loại file',
        level: 'Mức độ',
        language: 'Ngôn ngữ',
        rating: 'Đánh giá'
      }
      return labels[key] || key
    }

    const handlePreview = (document) => {
      const fullDocument = documents.value.find(doc => doc.id === document.id) || document
      selectedDocument.value = fullDocument
      previewModalOpen.value = true
    }

    const handleDownload = (document) => {
      // In production, track download and trigger actual download
      console.log('Download:', document)
      // window.open(document.fileUrl, '_blank')
    }

    const handleSave = async (data) => {
      console.log('💾 DocumentsView - handleSave called:', data)
      try {
        const { document, saved } = data
        const userId = localStorage.getItem('userId')
        console.log('💾 DocumentsView - UserId from localStorage:', userId)
        
        if (!userId) {
          console.warn('💾 DocumentsView - No userId found')
          alert('Bạn cần đăng nhập để lưu tài liệu')
          return
        }
        
        const documentId = document.document_id || document.id || document._id
        console.log('💾 DocumentsView - Document ID to save:', documentId)
        
        // Call API to add/remove bookmark
        const endpoint = 'http://localhost:3000/api/documents/bookmarks'
        
        console.log('💾 DocumentsView - Sending request to:', endpoint)
        console.log('💾 DocumentsView - Request body:', { userId, documentId, method: saved ? 'POST' : 'DELETE' })
        
        let response
        try {
          response = await fetch(endpoint, {
            method: saved ? 'POST' : 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: userId,
              documentId: documentId
            })
          })
          console.log('💾 DocumentsView - Response received:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
          })
        } catch (fetchError) {
          console.error('❌ DocumentsView - Fetch error:', fetchError)
          throw new Error(`Không thể kết nối đến server: ${fetchError.message}`)
        }
        
        console.log('💾 DocumentsView - Response status:', response.status, response.statusText)
        
        // Handle non-JSON responses (like timeout errors)
        if (!response.ok || response.status >= 400) {
          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text()
            console.error('❌ DocumentsView - Non-JSON response:', text)
            throw new Error(`Server error: ${response.status} ${response.statusText}. ${text.substring(0, 100)}`)
          }
        }
        
        const result = await response.json()
        console.log('💾 DocumentsView - Response data:', result)
        
        if (result.success) {
          console.log('✅ DocumentsView - Bookmark saved successfully')
        } else {
          console.error('❌ DocumentsView - Bookmark save failed:', result.message)
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('❌ DocumentsView - Error saving bookmark:', error)
        alert('Có lỗi xảy ra khi lưu tài liệu')
      }
    }

    const handleReport = (document) => {
      // Show report dialog
      console.log('Report:', document)
      alert('Tính năng báo cáo sẽ được triển khai sớm.')
    }

    // eslint-disable-next-line no-unused-vars
    const handleUploadSuccess = (_data) => {
      // Refresh documents list
      fetchDocuments()
      showUploadModal.value = false
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
        updateURL()
      }
    }

    const loadMore = () => {
      currentPage.value++
    }

    const updateURL = () => {
      const query = {}
      if (searchQuery.value) query.q = searchQuery.value
      if (activeFilters.value.category) query.category = activeFilters.value.category
      if (activeFilters.value.program) query.program = activeFilters.value.program
      if (activeFilters.value.year) query.year = activeFilters.value.year
      if (activeFilters.value.fileType) query.fileType = activeFilters.value.fileType
      if (activeFilters.value.level) query.level = activeFilters.value.level
      if (activeFilters.value.language) query.language = activeFilters.value.language
      if (activeFilters.value.tags.length > 0) query.tags = activeFilters.value.tags.join(',')
      if (activeFilters.value.minRating > 0) query.minRating = activeFilters.value.minRating
      if (activeFilters.value.sortBy !== 'relevance') query.sort = activeFilters.value.sortBy
      if (currentPage.value > 1) query.page = currentPage.value

      router.replace({ query })
    }

    const loadFromURL = () => {
      const query = route.query
      if (query.q) searchQuery.value = query.q
      if (query.category) activeFilters.value.category = query.category
      if (query.program) activeFilters.value.program = query.program
      if (query.year) activeFilters.value.year = query.year
      if (query.fileType) activeFilters.value.fileType = query.fileType
      if (query.level) activeFilters.value.level = query.level
      if (query.language) activeFilters.value.language = query.language
      if (query.tags) activeFilters.value.tags = query.tags.split(',')
      if (query.minRating) activeFilters.value.minRating = parseFloat(query.minRating)
      if (query.sort) activeFilters.value.sortBy = query.sort
      if (query.page) currentPage.value = parseInt(query.page)
    }

    // Debounce search
    let searchTimeout = null
    watch(searchQuery, () => {
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        currentPage.value = 1
        updateURL()
      }, 300)
    })

    // Infinite scroll
    const handleScroll = () => {
      if (!useInfiniteScroll.value || loading.value) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight - 100 && hasMore.value) {
        loadMore()
      }
    }

    onMounted(() => {
      loadFromURL()
      fetchDocuments()
      
      // Check if upload query param is present
      if (route.query.upload === 'true') {
        showUploadModal.value = true
        // Remove query param from URL
        router.replace({ query: { ...route.query, upload: undefined } })
      }
      
      // Listen for open-upload-modal event
      bus.on('open-upload-modal', () => {
        showUploadModal.value = true
      })
      
      if (useInfiniteScroll.value) {
        window.addEventListener('scroll', handleScroll)
      }
    })

    onUnmounted(() => {
      if (useInfiniteScroll.value) {
        window.removeEventListener('scroll', handleScroll)
      }
      if (searchTimeout) clearTimeout(searchTimeout)
      bus.off('open-upload-modal')
    })

    return {
      loading,
      documents,
      searchQuery,
      activeFilters,
      previewModalOpen,
      selectedDocument,
      showUploadModal,
      currentPage,
      documentsPerPage,
      useInfiniteScroll,
      programs,
      categories,
      featuredCollections,
      topAuthors,
      quickTags,
      availableTags,
      isLoggedIn,
      userName,
      activeCategory,
      filteredDocuments,
      hasActiveFilters,
      activeFilterChips,
      totalPages,
      displayPages,
      hasMore,
      displayDocuments,
      handleSearch,
      handleFilterChange,
      removeFilter,
      clearAllFilters,
      addTagFilter,
      filterByCollection,
      getFilterLabel,
      handlePreview,
      handleDownload,
      handleSave,
      handleReport,
      handleUploadSuccess,
      changePage,
      loadMore,
      formatDocumentForCard
    }
  }
}
</script>

<style scoped>
/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-2) var(--spacing-4);
  z-index: var(--z-tooltip);
  text-decoration: none;
  border-radius: 0 0 var(--radius-sm) 0;
}

.skip-link:focus {
  top: 0;
}

/* Breadcrumbs */
.breadcrumbs {
  padding: var(--spacing-4) var(--spacing-4) 0;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding-top: calc(80px + var(--spacing-4)); /* Account for fixed header */
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: var(--transition-fast);
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--color-neutral-400);
  font-size: var(--font-size-sm);
}

.breadcrumb-current {
  color: var(--color-neutral-600);
  font-size: var(--font-size-sm);
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, #764ba2 100%);
  color: white;
  padding: var(--spacing-8) var(--spacing-4) var(--spacing-6);
  margin-bottom: var(--spacing-6);
  margin-top: -20px; /* Push down below fixed header */
}

.header-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  text-align: center;
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-3);
  line-height: var(--line-height-tight);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.95;
  margin-bottom: var(--spacing-6);
}

.search-section {
  max-width: 600px;
  margin: 0 auto var(--spacing-4);
}

.header-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}

.upload-cta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-6);
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-base);
}

.upload-cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.upload-cta:focus-visible {
  outline: 3px solid white;
  outline-offset: 2px;
}

.sign-in-link {
  padding: var(--spacing-3) var(--spacing-6);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: var(--transition-base);
}

.sign-in-link:hover {
  background: white;
  color: var(--color-primary);
}

.user-info {
  color: white;
  font-size: var(--font-size-sm);
}

.user-name {
  font-weight: var(--font-weight-medium);
}

/* Page Layout */
.page-layout {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.sidebar-section {
  background: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}

.sidebar-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-4);
}

.collections-list,
.authors-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.collection-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  width: 100%;
  text-align: left;
}

.collection-link:hover {
  background: var(--color-neutral-100);
}

.collection-icon {
  font-size: var(--font-size-2xl);
}

.collection-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  flex: 1;
}

.collection-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-dark);
  font-size: var(--font-size-sm);
}

.collection-count {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-600);
}

.author-item {
  padding: var(--spacing-2) 0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  flex: 1;
}

.author-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-dark);
  font-size: var(--font-size-sm);
}

.author-count {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-600);
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.quick-tag {
  padding: var(--spacing-1) var(--spacing-3);
  background: var(--color-neutral-100);
  color: var(--color-dark);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.quick-tag:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  align-items: center;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-primary-light);
  color: var(--color-dark);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.chip-label {
  font-weight: var(--font-weight-medium);
}

.chip-value {
  font-weight: var(--font-weight-semibold);
}

.chip-remove {
  background: transparent;
  border: none;
  color: var(--color-neutral-600);
  cursor: pointer;
  font-size: var(--font-size-lg);
  line-height: 1;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition-fast);
}

.chip-remove:hover {
  background: var(--color-neutral-300);
  color: var(--color-error);
}

.clear-all-chips {
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-neutral-100);
  color: var(--color-dark);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-fast);
}

.clear-all-chips:hover {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-400);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-8) 0;
}

.skeleton-loader {
  height: 300px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.loading-text {
  text-align: center;
  color: var(--color-neutral-600);
  font-size: var(--font-size-base);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-12) var(--spacing-4);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: var(--spacing-4);
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-2);
}

.empty-message {
  font-size: var(--font-size-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--spacing-6);
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-3);
}

/* Documents Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Exactly 3 columns per row */
  grid-auto-rows: 480px; /* Fixed row height matching card height */
  gap: 24px; /* Fixed gap for uniform spacing */
  margin-bottom: var(--spacing-6);
  align-items: start;
}

.document-card-wrapper {
  display: flex;
  width: 100%; /* Fill grid column */
  height: 480px; /* Fixed height matching grid row */
  max-width: 100%;
}

@media (max-width: 959px) {
  .documents-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
    gap: 20px;
  }

  .document-card-wrapper {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 599px) {
  .documents-grid {
    grid-template-columns: 1fr; /* Single column on mobile */
    grid-auto-rows: 420px;
    gap: 16px;
  }

  .document-card-wrapper {
    width: 100%;
    max-width: 100%;
    height: 420px;
  }
}

/* Pagination */
.pagination-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  padding: var(--spacing-2);
  border: 2px solid var(--color-neutral-200);
  background: white;
  color: var(--color-dark);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.page-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.load-more-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-base);
}

.load-more-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.result-count {
  text-align: center;
  color: var(--color-neutral-600);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-4);
}

/* Responsive */
@media (max-width: 959px) {
  .breadcrumbs {
    padding-top: calc(70px + var(--spacing-4)); /* Smaller header on mobile */
  }

  .page-header {
    margin-top: 70px; /* Smaller header on mobile */
  }

  .page-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }

  .main-content {
    order: 1;
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .documents-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 599px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
  }

  .header-actions {
    flex-direction: column;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }

  .upload-cta,
  .sign-in-link {
    width: 100%;
    justify-content: center;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton-loader,
  .upload-cta,
  .load-more-btn,
  .page-btn {
    animation: none;
    transition: none;
  }
}
</style>
