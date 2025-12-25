<template>
  <div class="documents-management admin-page">
    <div class="section-header">
      <h2>Quản lý tài liệu</h2>
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm tài liệu..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Đang tải...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Lượt tải</th>
            <th>Lượt xem</th>
            <th>Trạng thái</th>
            <th>Ngày đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documents" :key="doc._id || doc.id">
            <td>{{ doc.title }}</td>
            <td>{{ doc.author?.name || '-' }}</td>
            <td>{{ doc.downloads || 0 }}</td>
            <td>{{ doc.views || 0 }}</td>
            <td>
              <span v-if="isSoftDeleted(doc)" class="status-badge archived">Đã xóa mềm</span>
              <span v-else class="status-badge active">Đang hoạt động</span>
            </td>
            <td>{{ formatDate(doc.uploadDate || doc.createdAt) }}</td>
            <td>
              <button @click="viewDocument(doc)" class="btn-action">Xem</button>
              <button
                v-if="!isSoftDeleted(doc)"
                @click="deleteDocument(doc)"
                class="btn-action btn-delete"
              >Xóa</button>

              <button
                v-else
                @click="restoreDocument(doc)"
                class="btn-action"
              >Khôi phục</button>

              <button
                v-if="isSoftDeleted(doc)"
                @click="deleteDocumentPermanent(doc)"
                class="btn-action btn-delete"
              >Xóa vĩnh viễn</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="documents.length === 0" class="empty-state">
        Không có dữ liệu
      </div>
    </div>
  </div>
</template>

<script>
import { getAllDocuments, deleteDocument, restoreDocument, deleteDocumentPermanent } from '@/utils/adminAPI.js'

export default {
  name: 'DocumentsManagement',
  data() {
    return {
      documents: [],
      loading: false,
      error: '',
      searchQuery: ''
    }
  },
  mounted() {
    this.loadDocuments()
  },
  methods: {
    async loadDocuments() {
      this.loading = true
      this.error = ''
      
      try {
        const params = { limit: 100, status: 'all', visibility: 'all' }
        if (this.searchQuery) {
          params.search = this.searchQuery
        }
        
        const result = await getAllDocuments(params)
        if (result.success) {
          this.documents = result.data || []
        } else {
          this.error = result.message || 'Không thể tải danh sách tài liệu'
        }
      } catch (error) {
        console.error('Error loading documents:', error)
        this.error = 'Có lỗi xảy ra khi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.loadDocuments()
      }, 500)
    },
    viewDocument(doc) {
      alert(`Thông tin tài liệu:\n\nTiêu đề: ${doc.title}\nTác giả: ${doc.author?.name || '-'}\nLượt tải: ${doc.downloads || 0}\nLượt xem: ${doc.views || 0}`)
    },
    isSoftDeleted(doc) {
      return doc?.status === 'archived' || doc?.visibility === 'private'
    },
    async deleteDocument(doc) {
      if (!confirm(`Bạn có chắc muốn xóa tài liệu "${doc.title}"?`)) {
        return
      }

      try {
        const docId = doc._id || doc.id || doc.document_id
        const result = await deleteDocument(docId)
        
        if (result.success) {
          this.loadDocuments()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error deleting document:', error)
        alert('Có lỗi xảy ra khi xóa')
      }
    },
    async restoreDocument(doc) {
      if (!confirm(`Bạn có chắc muốn khôi phục tài liệu "${doc.title}"?`)) {
        return
      }

      try {
        const docId = doc._id || doc.id || doc.document_id
        const result = await restoreDocument(docId)

        if (result.success) {
          this.loadDocuments()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error restoring document:', error)
        alert('Có lỗi xảy ra khi khôi phục')
      }
    },
    async deleteDocumentPermanent(doc) {
      const confirm1 = confirm(`XÓA VĨNH VIỄN sẽ xóa tài liệu và file liên quan trên ổ đĩa.\n\nBạn có chắc muốn xóa vĩnh viễn "${doc.title}"?`)
      if (!confirm1) return

      const confirm2 = confirm('Thao tác này KHÔNG THỂ HOÀN TÁC. Nhấn OK để xác nhận lần nữa.')
      if (!confirm2) return

      try {
        const docId = doc._id || doc.id || doc.document_id
        const result = await deleteDocumentPermanent(docId)

        if (result.success) {
          this.loadDocuments()
        } else {
          alert(result.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        console.error('Error permanently deleting document:', error)
        alert('Có lỗi xảy ra khi xóa vĩnh viễn')
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.documents-management {
  background: white;
  padding: 30px;
  border-radius: 4px;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: normal;
  color: #333;
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  color: #d32f2f;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: 500;
  color: #333;
}

.data-table tr:hover {
  background-color: #f9f9f9;
}

.btn-action {
  padding: 6px 12px;
  margin-right: 8px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-action:hover {
  background-color: #555;
}

.btn-delete {
  background-color: #d32f2f;
}

.btn-delete:hover {
  background-color: #b71c1c;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>


