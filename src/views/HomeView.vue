<template>
  <div class="home-page">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Chuyển đến nội dung chính</a>

    <!-- Hero Section with Search -->
    <HeroSection
      :title="heroData.title"
      :subtitle="heroData.subtitle"
    >
      <template #search>
        <SearchBar
          :model-value="searchQuery"
          :placeholder="'Tìm theo môn, mã học phần, tên tác giả...'"
          :filters="searchFilters"
          @update:model-value="searchQuery = $event"
          @search="handleSearch"
          @filter-change="handleFilterChange"
        />
      </template>
    </HeroSection>

    <!-- Main Content -->
    <main id="main-content" class="main-content" role="main">
      <!-- Featured Collections -->
      <CollectionCarousel
        v-if="featuredCollections.length > 0"
        title="Bộ sưu tập nổi bật"
        :collections="featuredCollections"
        @select-collection="handleCollectionSelect"
      />

      <!-- Search Results Preview -->
      <section
        v-if="showSearchResults && searchResults.length > 0"
        class="section search-results-section"
        aria-label="Kết quả tìm kiếm"
      >
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              Kết quả tìm kiếm
              <span class="result-count">({{ searchResults.length }})</span>
            </h2>
            <button
              class="clear-search-btn"
              type="button"
              @click="clearSearch"
            >
              Xóa bộ lọc
            </button>
          </div>
          <div class="documents-grid">
            <DocumentCard
              v-for="doc in searchResults"
              :key="doc.id"
              dense
              :document="doc"
              @preview="handlePreview"
              @download="handleDownload"
              @save="handleSave"
            />
          </div>
          <div v-if="hasMoreResults" class="load-more">
            <button
              class="btn btn-secondary"
              type="button"
              @click="loadMore"
            >
              Tải thêm
            </button>
          </div>
        </div>
      </section>

      <!-- Empty Search State -->
      <section
        v-if="showSearchResults && searchResults.length === 0"
        class="section empty-state-section"
        aria-label="Không tìm thấy kết quả"
      >
        <div class="container">
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>Không tìm thấy kết quả</h3>
            <p>Thử bỏ bớt bộ lọc hoặc kiểm tra chính tả.</p>
            <button class="btn btn-primary" type="button" @click="clearSearch">
              Xem tất cả tài liệu
            </button>
          </div>
        </div>
      </section>

      <!-- Recommended Documents -->
      <section
        v-if="!showSearchResults && recommendedDocuments.length > 0"
        class="section courses-section"
        aria-label="Tài liệu đề xuất"
      >
        <div class="container">
          <h2 class="section-title">Tài liệu đề xuất</h2>
          <div class="documents-grid">
            <DocumentCard
              v-for="doc in recommendedDocuments"
              :key="doc.id"
              dense
              :document="doc"
              @preview="handlePreview"
              @download="handleDownload"
              @save="handleSave"
            />
          </div>
        </div>
      </section>

      <!-- Latest Documents -->
      <section
        v-if="!showSearchResults"
        class="section latest-section"
        aria-label="Tài liệu mới nhất"
      >
        <div class="container">
          <h2 class="section-title">Tài liệu mới nhất</h2>
          <div v-if="loadingLatestDocuments" class="loading-state">
            <p>Đang tải tài liệu mới nhất...</p>
          </div>
          <div v-else-if="latestDocuments.length > 0" class="documents-grid">
            <DocumentCard
              v-for="doc in latestDocuments"
              :key="doc.id"
              dense
              :document="doc"
              @preview="handlePreview"
              @download="handleDownload"
              @save="handleSave"
            />
          </div>
          <div v-else class="empty-state">
            <p>Chưa có tài liệu nào.</p>
          </div>
        </div>
      </section>

      <!-- Popular by Category -->
      <section
        v-if="!showSearchResults && popularByProgram.length > 0"
        class="section popular-section"
        aria-label="Tài liệu phổ biến theo ngành"
      >
        <div class="container">
          <h2 class="section-title">Tài liệu phổ biến theo ngành</h2>
          <div
            v-for="category in popularByProgram"
            :key="category.id"
            class="category-block"
          >
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="documents-grid">
              <DocumentCard
                v-for="doc in category.documents"
                :key="doc.id"
                dense
                :document="doc"
                @preview="handlePreview"
                @download="handleDownload"
                @save="handleSave"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Community Teaser -->
      <section
        v-if="!showSearchResults"
        class="section community-section"
        aria-label="Cộng đồng"
      >
        <div class="container">
          <div class="community-wrapper">
            <div class="community-content">
              <h2 class="section-title">Tham gia cộng đồng</h2>
              <p class="community-description">
                Đặt câu hỏi, chia sẻ kiến thức và kết nối với cộng đồng học tập
              </p>
              <router-link to="/diendan" class="btn btn-primary">
                Đến diễn đàn
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Preview Modal -->
    <PreviewModal
      :is-open="previewModalOpen"
      :document="selectedDocument"
      @close="closePreview"
      @download="handleDownload"
      @report="handleReport"
    />

    <!-- Toast Notifications -->
    <ToastNotification />
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import SearchBar from '@/components/SearchBar.vue'
import CollectionCarousel from '@/components/CollectionCarousel.vue'
import DocumentCard from '@/components/DocumentCard.vue'
import PreviewModal from '@/components/PreviewModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import homepageData from '@/data/homepageData.json'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    SearchBar,
    CollectionCarousel,
    DocumentCard,
    PreviewModal,
    ToastNotification
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const searchQuery = ref('')
    const searchFilters = ref([])
    const showSearchResults = ref(false)
    const searchResults = ref([])
    const previewModalOpen = ref(false)
    const selectedDocument = ref(null)
    const hasMoreResults = ref(false)

    // Data from JSON
    const heroData = ref(homepageData.hero)
    const featuredCollections = ref(homepageData.featuredCollections)

    // Transform documents data
    const allDocuments = ref(homepageData.documents)

    // Latest documents from API
    const latestDocuments = ref([])
    const loadingLatestDocuments = ref(false)

    // Recommended documents (top downloads) from API
    const recommendedDocuments = ref([])
    const loadingRecommendedDocuments = ref(false)

    // Popular documents grouped by program from API
    const popularByProgram = ref([])
    const loadingPopularByProgram = ref(false)

    const normalizeProgramKey = (rawProgram) => {
      if (!rawProgram) return ''
      return rawProgram
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
    }

    // Homepage categories (fixed). These are display-only and do not modify DB.
    // Note: mapping "biology" is assumed to be "Sinh học" based on your example sentence.
    // If you actually meant "chemistry" -> "Hóa học", tell me and I will adjust.
    const homepageProgramCategories = [
      {
        key: 'cntt',
        label: 'Công nghệ thông tin',
        rawKeys: ['cntt', 'it', 'công nghệ thông tin', 'cong nghe thong tin']
      },
      {
        key: 'hoa-hoc',
        label: 'Hóa học',
        rawKeys: ['hóa học', 'hoa hoc', 'chemistry', 'chemical']
      },
      {
        key: 'kinh-doanh',
        label: 'Kinh doanh',
        rawKeys: ['kinh doanh', 'business']
      },
      {
        key: 'kinh-te',
        label: 'Kinh tế',
        rawKeys: ['kinh tế', 'kinh te', 'econ', 'economics']
      },
      {
        key: 'ky-thuat',
        label: 'Kỹ thuật',
        rawKeys: ['kỹ thuật', 'ky thuat', 'engineering']
      },
      {
        key: 'sinh-hoc',
        label: 'Sinh học',
        rawKeys: ['sinh học', 'sinh hoc', 'biology']
      },
      {
        key: 'toan',
        label: 'Toán',
        rawKeys: ['toán', 'toan', 'toán học', 'toan hoc', 'math', 'mathematics']
      },
      {
        key: 'vat-ly',
        label: 'Vật lý',
        rawKeys: ['vật lý', 'vat ly', 'physics']
      }
    ]

    const homepageCategoryByRawKey = new Map()
    for (const category of homepageProgramCategories) {
      for (const rawKey of category.rawKeys) {
        homepageCategoryByRawKey.set(normalizeProgramKey(rawKey), category.key)
      }
    }

    const getHomepageCategoryKey = (rawProgram) => {
      const key = normalizeProgramKey(rawProgram)
      if (!key) return ''
      return homepageCategoryByRawKey.get(key) || ''
    }

    const getHomepageCategoryLabel = (rawProgram) => {
      const categoryKey = getHomepageCategoryKey(rawProgram)
      if (!categoryKey) return (rawProgram || '').toString().trim()
      const category = homepageProgramCategories.find((c) => c.key === categoryKey)
      return category ? category.label : (rawProgram || '').toString().trim()
    }

    const formatProgramLabel = (rawProgram) => {
      if (!rawProgram) return ''
      const trimmed = rawProgram.toString().trim()
      if (!trimmed) return ''
      return getHomepageCategoryLabel(trimmed)
    }

    const normalizeApiDocument = (doc) => {
      const programRaw = (doc.program || '').toString().trim()
      return {
        id: doc.id || doc.document_id,
        document_id: doc.document_id,
        title: doc.title,
        description: doc.description,
        thumbnail: doc.thumbnail ? `http://localhost:3003${doc.thumbnail}` : null,
        authors: doc.author ? [doc.author.name || doc.author] : ['N/A'],
        author: doc.author ? (typeof doc.author === 'object' ? doc.author.name : doc.author) : 'N/A',
        programRaw,
        program: formatProgramLabel(programRaw),
        courseCode: doc.courseCode || '',
        year: doc.year || '',
        tags: doc.tags || [],
        downloads: doc.downloads || 0,
        views: doc.views || 0,
        rating: doc.rating || 0,
        ratingCount: doc.ratingCount || 0,
        fileType: doc.file?.fileType || 'PDF',
        license: doc.license || '',
        fileUrl: doc.file?.fileUrl ? `http://localhost:3003${doc.file.fileUrl}` : '',
        uploadDate: doc.uploadDate || doc.createdAt || new Date().toISOString()
      }
    }

    // Fetch latest documents from API
    const fetchLatestDocuments = async () => {
      loadingLatestDocuments.value = true
      try {
        console.log('📥 Fetching latest documents from API...')
        
        // Fetch all documents to sort by year (backend doesn't have year-based sort)
        const url = `/api/documents?limit=100&sortBy=newest`
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('✅ Latest documents fetched:', result.data?.length || 0)
        
        if (result.success && result.data && result.data.length > 0) {
          // Transform API response to match expected format
          let docs = result.data.map(doc => {
            // Extract year from year field or from createdAt/uploadDate
            let docYear = doc.year
            if (!docYear && (doc.uploadDate || doc.createdAt)) {
              docYear = new Date(doc.uploadDate || doc.createdAt).getFullYear()
            }
            if (!docYear) {
              docYear = new Date().getFullYear()
            }
            
            return {
              id: doc.id || doc.document_id,
              document_id: doc.document_id,
              title: doc.title,
              description: doc.description,
              thumbnail: doc.thumbnail ? `http://localhost:3003${doc.thumbnail}` : null,
              authors: doc.author ? [doc.author.name || doc.author] : ['N/A'],
              author: doc.author ? (typeof doc.author === 'object' ? doc.author.name : doc.author) : 'N/A',
              program: doc.program || '',
              courseCode: doc.courseCode || '',
              year: docYear,
              tags: doc.tags || [],
              downloads: doc.downloads || 0,
              views: doc.views || 0,
              rating: doc.rating || 0,
              ratingCount: doc.ratingCount || 0,
              fileType: doc.file?.fileType || 'PDF',
              license: doc.license || '',
              fileUrl: doc.file?.fileUrl ? `http://localhost:3003${doc.file.fileUrl}` : '',
              uploadDate: doc.uploadDate || doc.createdAt || new Date().toISOString()
            }
          })
          
          // Sort by year (most recent first), then by uploadDate if same year
          docs.sort((a, b) => {
            // First sort by year (descending - newest year first)
            const yearA = parseInt(a.year) || 0
            const yearB = parseInt(b.year) || 0
            if (yearB !== yearA) {
              return yearB - yearA
            }
            // If same year, sort by uploadDate (newest first)
            if (a.uploadDate && b.uploadDate) {
              return new Date(b.uploadDate) - new Date(a.uploadDate)
            }
            return 0
          })
          
          // Take top 6 documents
          latestDocuments.value = docs.slice(0, 6)
        } else {
          // Fallback to mock data if API returns empty
          console.warn('⚠️ No latest documents from API, using mock data')
          latestDocuments.value = [...allDocuments.value]
            .sort((a, b) => (b.year || 0) - (a.year || 0))
            .slice(0, 6)
        }
      } catch (error) {
        console.error('❌ Error fetching latest documents:', error)
        // Fallback to mock data on error
        console.warn('⚠️ Using mock data due to error')
        latestDocuments.value = [...allDocuments.value]
          .sort((a, b) => (b.year || 0) - (a.year || 0))
          .slice(0, 6)
      } finally {
        loadingLatestDocuments.value = false
      }
    }

    const fetchRecommendedDocuments = async () => {
      loadingRecommendedDocuments.value = true
      try {
        const url = `/api/documents?limit=6&sortBy=downloads`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          recommendedDocuments.value = result.data.map(normalizeApiDocument)
        } else {
          recommendedDocuments.value = [...allDocuments.value]
            .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
            .slice(0, 6)
        }
      } catch (error) {
        console.error('❌ Error fetching recommended documents:', error)
        recommendedDocuments.value = [...allDocuments.value]
          .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
          .slice(0, 6)
      } finally {
        loadingRecommendedDocuments.value = false
      }
    }

    const fetchPopularByProgram = async () => {
      loadingPopularByProgram.value = true
      try {
        const url = `/api/documents?limit=200&sortBy=newest`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const normalizedDocs = result.data.map(normalizeApiDocument)

          const groupsByCategoryKey = new Map()
          for (const doc of normalizedDocs) {
            const raw = (doc.programRaw || '').toString().trim()
            if (!raw) continue
            const categoryKey = getHomepageCategoryKey(raw)
            if (!categoryKey) continue

            if (!groupsByCategoryKey.has(categoryKey)) {
              groupsByCategoryKey.set(categoryKey, [])
            }
            groupsByCategoryKey.get(categoryKey).push(doc)
          }

          const categoriesInOrder = homepageProgramCategories.map((category) => {
            const docs = groupsByCategoryKey.get(category.key) || []
            const sortedDocs = [...docs].sort((a, b) => {
              const yearA = parseInt(a.year) || 0
              const yearB = parseInt(b.year) || 0
              if (yearB !== yearA) return yearB - yearA
              const dateA = a.uploadDate ? new Date(a.uploadDate) : new Date(0)
              const dateB = b.uploadDate ? new Date(b.uploadDate) : new Date(0)
              return dateB - dateA
            })

            const maxYear = sortedDocs.reduce((acc, d) => Math.max(acc, parseInt(d.year) || 0), 0)

            return {
              id: category.key,
              name: category.label,
              maxYear,
              documents: sortedDocs.slice(0, 6)
            }
          })

          popularByProgram.value = categoriesInOrder
        } else {
          popularByProgram.value = []
        }
      } catch (error) {
        console.error('❌ Error fetching popular documents by program:', error)
        popularByProgram.value = []
      } finally {
        loadingPopularByProgram.value = false
      }
    }

    // Methods
    const handleSearch = async (query) => {
      if (!query.trim()) {
        showSearchResults.value = false
        searchResults.value = []
        return
      }

      try {
        console.log('🔍 Searching for:', query)
        
        // Search from API
        const url = `/api/documents/search?q=${encodeURIComponent(query.trim())}&limit=50`
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('✅ Search results:', result.data?.length || 0)
        
        if (result.success && result.data) {
          // Transform API response to match expected format
          searchResults.value = result.data.map(doc => ({
            id: doc.id || doc.document_id,
            document_id: doc.document_id,
            title: doc.title,
            description: doc.description,
            thumbnail: doc.thumbnail ? `http://localhost:3003${doc.thumbnail}` : null,
            authors: doc.author ? [doc.author.name || doc.author] : ['N/A'],
            author: doc.author ? (typeof doc.author === 'object' ? doc.author.name : doc.author) : 'N/A',
            program: doc.program || '',
            courseCode: doc.courseCode || '',
            year: doc.year || new Date().getFullYear(),
            tags: doc.tags || [],
            downloads: doc.downloads || 0,
            views: doc.views || 0,
            rating: doc.rating || 0,
            ratingCount: doc.ratingCount || 0,
            fileType: doc.file?.fileType || 'PDF',
            license: doc.license || '',
            fileUrl: doc.file?.fileUrl ? `http://localhost:3003${doc.file.fileUrl}` : '',
            uploadDate: doc.uploadDate || doc.createdAt || new Date().toISOString()
          }))
        } else {
          searchResults.value = []
        }

        showSearchResults.value = true

        // Track analytics event
        if (window.$toast) {
          window.$toast.info(`Tìm thấy ${searchResults.value.length} kết quả`)
        }
      } catch (error) {
        console.error('❌ Search error:', error)
        
        // Fallback to local search if API fails
        console.warn('⚠️ Falling back to local search')
        const queryLower = query.toLowerCase()
        searchResults.value = [...latestDocuments.value, ...allDocuments.value].filter((doc, index, self) => {
          // Remove duplicates by id
          const isDuplicate = self.findIndex(d => d.id === doc.id) !== index
          if (isDuplicate) return false
          
          const titleMatch = doc.title.toLowerCase().includes(queryLower)
          const tagMatch = doc.tags?.some(tag => tag.toLowerCase().includes(queryLower))
          const authorMatch = typeof doc.author === 'object'
            ? doc.author.name?.toLowerCase().includes(queryLower)
            : doc.author?.toLowerCase().includes(queryLower)
          return titleMatch || tagMatch || authorMatch
        })

        showSearchResults.value = true

        if (window.$toast) {
          window.$toast.warning(`Tìm kiếm offline: ${searchResults.value.length} kết quả`)
        }
      }
    }

    const handleFilterChange = (filters) => {
      // Apply filters to search
      // This would typically trigger a new search
      searchFilters.value = filters
      if (searchQuery.value) {
        handleSearch(searchQuery.value)
      }
    }

    const clearSearch = () => {
      searchQuery.value = ''
      showSearchResults.value = false
      searchResults.value = []
    }

    const handleCollectionSelect = (collection) => {
      router.push(`/documents?collection=${collection.id}`)
    }

    const handlePreview = (document) => {
      selectedDocument.value = document
      previewModalOpen.value = true
    }

    const closePreview = () => {
      previewModalOpen.value = false
      selectedDocument.value = null
    }

    const handleDownload = (document) => {
      // TODO: Implement download logic
      if (window.$toast) {
        window.$toast.success(`Đang tải xuống: ${document.title}`)
      }
      // Track analytics: doc_download
    }

    const handleSave = async ({ document, saved }) => {
      console.log('💾 handleSave called:', { document, saved })
      try {
        const userId = localStorage.getItem('userId')
        console.log('💾 UserId from localStorage:', userId)
        
        if (!userId) {
          console.warn('💾 No userId found, user not logged in')
          if (window.$toast) {
            window.$toast.error('Bạn cần đăng nhập để lưu tài liệu')
          }
          return
        }
        
        const documentId = document.document_id || document.id || document._id
        console.log('💾 Document ID to save:', documentId)
        
        // Call API to add/remove bookmark
        const endpoint = 'http://localhost:3000/api/documents/bookmarks'
        
        console.log('💾 Sending request to:', endpoint)
        console.log('💾 Request body:', { userId, documentId, method: saved ? 'POST' : 'DELETE' })
        
        const response = await fetch(endpoint, {
          method: saved ? 'POST' : 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            documentId: documentId
          })
        })
        
        console.log('💾 Response status:', response.status, response.statusText)
        
        // Handle non-JSON responses (like timeout errors)
        if (!response.ok || response.status >= 400) {
          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text()
            console.error('❌ Non-JSON response:', text)
            throw new Error(`Server error: ${response.status} ${response.statusText}. ${text.substring(0, 100)}`)
          }
        }
        
        const result = await response.json()
        console.log('💾 Response data:', result)
        
        if (result.success) {
          console.log('✅ Bookmark saved successfully')
          if (window.$toast) {
            window.$toast.success(saved ? 'Đã lưu vào thư viện' : 'Đã bỏ lưu')
          }
        } else {
          console.error('❌ Bookmark save failed:', result.message)
          if (window.$toast) {
            window.$toast.error(result.message || 'Có lỗi xảy ra')
          }
        }
      } catch (error) {
        console.error('❌ Error saving bookmark:', error)
        if (window.$toast) {
          window.$toast.error('Có lỗi xảy ra khi lưu tài liệu')
        }
      }
    }

    const handleReport = (document) => {
      // TODO: Open report modal
      if (window.$toast) {
        window.$toast.info('Chức năng báo cáo sắp có mặt!')
      }
      console.log('Report document:', document.id)
    }


    const loadMore = () => {
      // TODO: Implement pagination
      if (window.$toast) {
        window.$toast.info('Đang tải thêm...')
      }
    }

    // Reset search when coming back to home
    watch(() => route.path, (newPath) => {
      if (newPath === '/' || newPath === '/home') {
        // Clear search state
        searchQuery.value = ''
        searchFilters.value = []
        showSearchResults.value = false
        searchResults.value = []
        hasMoreResults.value = false
      }
    })

    onMounted(() => {
      // Clear search on mount
      searchQuery.value = ''
      searchFilters.value = []
      showSearchResults.value = false
      searchResults.value = []
      hasMoreResults.value = false

      // Set page title and meta
      document.title = 'Open Learn Foundation'

      // Fetch latest documents from API
      fetchLatestDocuments()

      // Fetch homepage sections from API
      fetchRecommendedDocuments()
      fetchPopularByProgram()

      // Add structured data for SEO
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'EduShare',
        url: window.location.origin,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${window.location.origin}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)
    })

    return {
      searchQuery,
      searchFilters,
      showSearchResults,
      searchResults,
      previewModalOpen,
      selectedDocument,
      hasMoreResults,
      heroData,
      featuredCollections,
      recommendedDocuments,
      loadingRecommendedDocuments,
      latestDocuments,
      loadingLatestDocuments,
      popularByProgram,
      loadingPopularByProgram,
      fetchLatestDocuments,
      fetchRecommendedDocuments,
      fetchPopularByProgram,
      handleSearch,
      handleFilterChange,
      clearSearch,
      handleCollectionSelect,
      handlePreview,
      closePreview,
      handleDownload,
      handleSave,
      handleReport,
      loadMore
    }
  }
}
</script>

<style scoped>
/* Accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: #fff;
  padding: var(--spacing-2) var(--spacing-4);
  text-decoration: none;
  z-index: var(--z-sticky);
  border-radius: 0 0 var(--radius-sm) 0;
  font-weight: var(--font-weight-medium);
  transition: var(--transition-fast);
}

.skip-link:focus { 
  top: 0; 
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Page */
.home-page {
  min-height: 100vh;
  background: #ffffff;
  color: var(--color-dark);
  font-family: var(--font-family-base);
  line-height: var(--line-height-normal);
}

.main-content { 
  padding: 0; 
}

/* Containers */
.section { 
  padding: var(--spacing-16) 0;
  position: relative;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

/* Section Header & Titles */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-10);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.section-title {
  font-family: var(--font-family-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin: 0;
  text-align: center;
  margin-bottom: var(--spacing-8);
  position: relative;
  letter-spacing: -0.02em;
  line-height: var(--line-height-tight);
}

.section-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  margin: var(--spacing-4) auto 0;
  background: linear-gradient(90deg, var(--color-primary), #3b82f6);
  border-radius: var(--radius-full);
}

.section-header .section-title {
  text-align: left;
  margin-bottom: 0;
}

.section-header .section-title::after {
  margin-left: 0;
  margin-right: auto;
}

.result-count {
  font-size: var(--font-size-base);
  color: var(--color-neutral-500);
  font-weight: var(--font-weight-normal);
  margin-left: var(--spacing-2);
}

/* Controls */
.clear-search-btn {
  padding: var(--spacing-3) var(--spacing-6);
  background: #ffffff;
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  color: var(--color-neutral-700);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.clear-search-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(29, 78, 216, 0.15);
}

.clear-search-btn:active {
  transform: translateY(0);
}

.clear-search-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Grids */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-8);
  width: 100%;
}

/* States */
.empty-state-section { 
  padding: var(--spacing-20) 0; 
}

.empty-state { 
  text-align: center; 
  color: var(--color-neutral-500);
  max-width: 500px;
  margin: 0 auto;
}

.empty-state svg { 
  margin-bottom: var(--spacing-6); 
  color: var(--color-neutral-300);
  width: 64px;
  height: 64px;
  margin-left: auto;
  margin-right: auto;
}

.empty-state h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-4);
  letter-spacing: -0.01em;
}

.empty-state p { 
  margin-bottom: var(--spacing-8); 
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.loading-state { 
  text-align: center; 
  padding: var(--spacing-12) 0; 
  color: var(--color-neutral-500); 
}

.loading-state p { 
  margin: 0; 
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

/* Section Backgrounds */
.courses-section { 
  background: #ffffff;
}

.latest-section { 
  background: #f8fafc;
}

.popular-section { 
  background: #ffffff;
}

.category-block { 
  margin-bottom: var(--spacing-12); 
}

.category-block:last-child { 
  margin-bottom: 0; 
}

.category-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-dark);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-3);
  border-bottom: 3px solid var(--color-primary);
  text-align: left;
  letter-spacing: -0.01em;
}

/* Community */
.community-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, #3b82f6 100%);
  color: #ffffff;
  padding: var(--spacing-16) 0;
  position: relative;
  overflow: hidden;
}

.community-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.community-section .section-title,
.community-section .category-title { 
  color: #ffffff; 
}

.community-section .section-title::after {
  background: rgba(255, 255, 255, 0.3);
}

.community-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.community-content { 
  text-align: center;
  max-width: 600px;
}

.community-description {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-8);
  opacity: 0.95;
  color: rgba(255, 255, 255, 0.95);
}


.load-more { 
  text-align: center; 
  margin-top: var(--spacing-10); 
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4) var(--spacing-8);
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  text-decoration: none;
  transition: all var(--transition-base);
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
}

.btn-primary:hover { 
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: none;
}

.btn-secondary:hover { 
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.btn:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Community overrides */
.community-section .btn-primary {
  background: #ffffff;
  color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.community-section .btn-primary:hover { 
  background: #f8fafc;
  color: var(--color-primary-hover);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 959px) {
  .section { 
    padding: var(--spacing-12) 0; 
  }
  
  .container {
    padding: 0 var(--spacing-4);
  }
  
  .documents-grid { 
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
    gap: var(--spacing-6); 
  }
  
  .community-wrapper { 
    flex-direction: column;
  }
  
  .community-content { 
    text-align: center;
  }
  
  .section-title {
    margin-bottom: var(--spacing-6);
  }
}

@media (max-width: 599px) {
  .section { 
    padding: var(--spacing-10) 0; 
  }
  
  .documents-grid { 
    grid-template-columns: 1fr; 
    gap: var(--spacing-5);
  }
  
  .section-header { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: var(--spacing-4); 
    margin-bottom: var(--spacing-6);
  }
  
  .category-title { 
    font-size: var(--font-size-xl); 
  }
  
  .section-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-6);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .btn,
  .clear-search-btn { 
    transition: none; 
  }
  
  .btn:hover,
  .clear-search-btn:hover { 
    transform: none; 
  }
}
</style>