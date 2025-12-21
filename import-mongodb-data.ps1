# Script để import dữ liệu từ MongoDB local vào Docker MongoDB
Write-Host "📦 MongoDB Data Import Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Kiểm tra MongoDB local có đang chạy không
Write-Host "`n🔍 Checking local MongoDB..." -ForegroundColor Yellow
$localMongo = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if (-not $localMongo) {
    Write-Host "⚠️  Local MongoDB không chạy trên port 27017" -ForegroundColor Yellow
    Write-Host "   Bạn có thể:" -ForegroundColor Yellow
    Write-Host "   1. Chạy MongoDB local trước" -ForegroundColor Gray
    Write-Host "   2. Hoặc sử dụng MongoDB Atlas (cập nhật MONGODB_URI trong docker-compose.yml)" -ForegroundColor Gray
    $useLocal = Read-Host "`nBạn muốn tiếp tục với MongoDB local? (y/n)"
    if ($useLocal -ne "y") {
        Write-Host "❌ Đã hủy" -ForegroundColor Red
        exit
    }
}

# Kiểm tra Docker MongoDB có đang chạy không
Write-Host "`n🔍 Checking Docker MongoDB..." -ForegroundColor Yellow
$dockerMongo = docker-compose ps mongodb 2>&1 | Select-String -Pattern "Up|healthy"
if (-not $dockerMongo) {
    Write-Host "❌ Docker MongoDB không chạy. Đang khởi động..." -ForegroundColor Red
    docker-compose up -d mongodb
    Start-Sleep -Seconds 10
}

# Export từ local MongoDB
Write-Host "`n📤 Exporting data from local MongoDB..." -ForegroundColor Cyan
$backupDir = "./mongodb-backup"
if (Test-Path $backupDir) {
    Remove-Item -Recurse -Force $backupDir
}

try {
    mongodump --host=127.0.0.1:27017 --db=EduShareDB --out=$backupDir 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Export thành công!" -ForegroundColor Green
    } else {
        Write-Host "❌ Export thất bại. Kiểm tra MongoDB local có đang chạy không." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Lỗi khi export: $_" -ForegroundColor Red
    Write-Host "   Đảm bảo mongodump đã được cài đặt và MongoDB local đang chạy." -ForegroundColor Yellow
    exit 1
}

# Import vào Docker MongoDB
Write-Host "`n📥 Importing data to Docker MongoDB..." -ForegroundColor Cyan
try {
    mongorestore --host=localhost:27017 --db=EduShareDB "$backupDir/EduShareDB" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Import thành công!" -ForegroundColor Green
    } else {
        Write-Host "❌ Import thất bại." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Lỗi khi import: $_" -ForegroundColor Red
    exit 1
}

# Kiểm tra dữ liệu
Write-Host "`n🔍 Checking imported data..." -ForegroundColor Cyan
Write-Host "`nCollections:" -ForegroundColor Yellow
docker-compose exec -T mongodb mongosh EduShareDB --quiet --eval "db.getCollectionNames().forEach(c => print(c))"

Write-Host "`nDocument counts:" -ForegroundColor Yellow
$collections = @("Courses", "TaiLieu", "UserCollection", "BlogPosts", "posts", "Enrollments", "Payments")
foreach ($col in $collections) {
    $count = docker-compose exec -T mongodb mongosh EduShareDB --quiet --eval "db.$col.countDocuments()"
    Write-Host "  $col : $count" -ForegroundColor Gray
}

Write-Host "`n✅ Hoàn tất! Dữ liệu đã được import vào Docker MongoDB." -ForegroundColor Green
Write-Host "`nBây giờ bạn có thể refresh trang web để xem dữ liệu." -ForegroundColor Cyan

