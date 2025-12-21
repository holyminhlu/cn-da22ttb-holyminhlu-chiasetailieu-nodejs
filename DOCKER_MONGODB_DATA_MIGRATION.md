# 📦 Hướng Dẫn Import Dữ Liệu vào MongoDB Docker

## 🔍 Vấn Đề

MongoDB trong Docker là một instance **MỚI** và **TRỐNG**, không có dữ liệu từ MongoDB local cũ của bạn.

## ✅ Giải Pháp

Có 3 cách để có dữ liệu trong MongoDB Docker:

### Cách 1: Export từ MongoDB Local và Import vào Docker (Khuyên dùng)

#### Bước 1: Export dữ liệu từ MongoDB Local

```powershell
# Export tất cả collections từ MongoDB local
mongodump --uri="mongodb://127.0.0.1:27017/EduShareDB" --out=./mongodb-backup
```

Hoặc nếu MongoDB local đang chạy:
```powershell
mongodump --host=127.0.0.1:27017 --db=EduShareDB --out=./mongodb-backup
```

#### Bước 2: Import vào MongoDB Docker

```powershell
# Import vào MongoDB trong Docker
mongorestore --uri="mongodb://localhost:27017/EduShareDB" ./mongodb-backup/EduShareDB
```

Hoặc:
```powershell
mongorestore --host=localhost:27017 --db=EduShareDB ./mongodb-backup/EduShareDB
```

### Cách 2: Sử dụng MongoDB Atlas (Cloud) - Có sẵn dữ liệu

Nếu bạn đã có dữ liệu trên MongoDB Atlas, chỉ cần cập nhật `MONGODB_URI` trong `docker-compose.yml`:

```yaml
environment:
  MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/EduShareDB
```

Sau đó restart services:
```powershell
docker-compose restart
```

### Cách 3: Copy Volume từ MongoDB Local (Nâng cao)

Nếu MongoDB local và Docker MongoDB cùng version, có thể copy data directory:

```powershell
# Dừng MongoDB local
net stop MongoDB

# Copy data directory (thay đổi path phù hợp)
# Windows MongoDB thường ở: C:\Program Files\MongoDB\Server\7.0\data\db
# Copy vào Docker volume
```

## 🚀 Quick Start - Import Dữ Liệu

### Nếu MongoDB Local đang chạy:

```powershell
# 1. Export từ local
mongodump --host=127.0.0.1:27017 --db=EduShareDB --out=./mongodb-backup

# 2. Import vào Docker
mongorestore --host=localhost:27017 --db=EduShareDB ./mongodb-backup/EduShareDB

# 3. Kiểm tra dữ liệu
docker-compose exec mongodb mongosh EduShareDB --eval "db.Courses.countDocuments()"
docker-compose exec mongodb mongosh EduShareDB --eval "db.TaiLieu.countDocuments()"
```

### Nếu dùng MongoDB Atlas:

1. Lấy connection string từ MongoDB Atlas
2. Cập nhật `docker-compose.yml`:

```yaml
auth-service:
  environment:
    MONGODB_URI: mongodb+srv://username:password@cluster.mongodb.net/EduShareDB
```

3. Restart services:
```powershell
docker-compose restart
```

## 🔍 Kiểm Tra Dữ Liệu Sau Khi Import

```powershell
# Kiểm tra số lượng documents
docker-compose exec mongodb mongosh EduShareDB --eval "db.Courses.countDocuments()"
docker-compose exec mongodb mongosh EduShareDB --eval "db.TaiLieu.countDocuments()"
docker-compose exec mongodb mongosh EduShareDB --eval "db.UserCollection.countDocuments()"

# Xem tất cả collections
docker-compose exec mongodb mongosh EduShareDB --eval "db.getCollectionNames()"

# Xem một vài documents
docker-compose exec mongodb mongosh EduShareDB --eval "db.Courses.find().limit(1).pretty()"
```

## ⚠️ Lưu Ý

1. **MongoDB Local và Docker MongoDB phải cùng version** để tránh compatibility issues
2. **Backup trước khi import** nếu có dữ liệu quan trọng
3. **Kiểm tra connection string** đúng format
4. **Đảm bảo ports không conflict** - MongoDB local phải dừng hoặc dùng port khác

## 🐛 Troubleshooting

### Lỗi: "cannot connect to MongoDB"

- Kiểm tra MongoDB Docker đang chạy: `docker-compose ps mongodb`
- Kiểm tra port 27017: `netstat -ano | findstr :27017`

### Lỗi: "authentication failed"

- Kiểm tra connection string có đúng không
- Kiểm tra username/password trong MongoDB Atlas

### Lỗi: "database not found"

- MongoDB tự động tạo database khi import
- Đảm bảo tên database đúng: `EduShareDB`

## 📝 Script Tự Động

Tạo file `import-mongodb-data.ps1`:

```powershell
Write-Host "📦 Exporting data from local MongoDB..." -ForegroundColor Cyan
mongodump --host=127.0.0.1:27017 --db=EduShareDB --out=./mongodb-backup

Write-Host "📥 Importing data to Docker MongoDB..." -ForegroundColor Cyan
mongorestore --host=localhost:27017 --db=EduShareDB ./mongodb-backup/EduShareDB

Write-Host "✅ Done! Checking data..." -ForegroundColor Green
docker-compose exec mongodb mongosh EduShareDB --eval "db.getCollectionNames()"
```

Chạy:
```powershell
.\import-mongodb-data.ps1
```

