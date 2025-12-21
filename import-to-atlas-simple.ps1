# Script đơn giản để import dữ liệu lên MongoDB Atlas
Write-Host "📦 Import Dữ Liệu Lên MongoDB Atlas" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

$ATLAS_URI = "mongodb+srv://s7ludubai_db_user:0vlGxcs1X4IM9E7P@openlearnfoundation.du2nnrx.mongodb.net/OpenLearnFoundation"
$LOCAL_DB = "EduShareDB"
$BACKUP_DIR = "./mongodb-backup"

Write-Host "`n📤 Bước 1: Export từ MongoDB Local..." -ForegroundColor Yellow

# Kiểm tra MongoDB local
$localRunning = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue

if ($localRunning) {
    Write-Host "   MongoDB local đang chạy. Đang export..." -ForegroundColor Gray
    
    # Tìm mongodump
    $mongodump = Get-Command mongodump -ErrorAction SilentlyContinue
    if (-not $mongodump) {
        # Tìm trong Program Files
        $mongodumpPath = Get-ChildItem -Path "C:\Program Files\MongoDB" -Recurse -Filter "mongodump.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($mongodumpPath) {
            $mongodump = $mongodumpPath.FullName
        }
    }
    
    if ($mongodump) {
        if (Test-Path $BACKUP_DIR) {
            Remove-Item -Recurse -Force $BACKUP_DIR
        }
        
        if ($mongodump -is [System.Management.Automation.ApplicationInfo]) {
            & mongodump --host=127.0.0.1:27017 --db=$LOCAL_DB --out=$BACKUP_DIR
        } else {
            & $mongodump --host=127.0.0.1:27017 --db=$LOCAL_DB --out=$BACKUP_DIR
        }
        
        if ($LASTEXITCODE -eq 0 -and (Test-Path "$BACKUP_DIR/$LOCAL_DB")) {
            Write-Host "✅ Export thành công!" -ForegroundColor Green
        } else {
            Write-Host "❌ Export thất bại. Kiểm tra MongoDB local có dữ liệu không." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️  Không tìm thấy mongodump." -ForegroundColor Yellow
        Write-Host "   Vui lòng cài MongoDB Database Tools:" -ForegroundColor Yellow
        Write-Host "   https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
        Write-Host "`n   Hoặc import thủ công bằng MongoDB Compass" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⚠️  MongoDB local không chạy." -ForegroundColor Yellow
    Write-Host "   Nếu bạn đã có dữ liệu trên MongoDB Atlas, bỏ qua bước này." -ForegroundColor Yellow
    Write-Host "   Nếu cần export từ nơi khác, vui lòng chạy MongoDB local trước." -ForegroundColor Yellow
    $skip = Read-Host "`nBỏ qua export và chỉ import? (y/n)"
    if ($skip -ne "y") {
        exit 0
    }
}

Write-Host "`n📥 Bước 2: Import lên MongoDB Atlas..." -ForegroundColor Yellow

# Tìm mongorestore
$mongorestore = Get-Command mongorestore -ErrorAction SilentlyContinue
if (-not $mongorestore) {
    $mongorestorePath = Get-ChildItem -Path "C:\Program Files\MongoDB" -Recurse -Filter "mongorestore.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($mongorestorePath) {
        $mongorestore = $mongorestorePath.FullName
    }
}

if (-not $mongorestore) {
    Write-Host "❌ Không tìm thấy mongorestore." -ForegroundColor Red
    Write-Host "   Vui lòng cài MongoDB Database Tools:" -ForegroundColor Yellow
    Write-Host "   https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
    Write-Host "`n   Hoặc import thủ công bằng MongoDB Compass:" -ForegroundColor Yellow
    Write-Host "   1. Mở MongoDB Compass" -ForegroundColor Gray
    Write-Host "   2. Kết nối: $ATLAS_URI" -ForegroundColor Gray
    Write-Host "   3. Import từ file hoặc collection" -ForegroundColor Gray
    exit 1
}

if (Test-Path "$BACKUP_DIR/$LOCAL_DB") {
    Write-Host "   Đang import..." -ForegroundColor Gray
    
    if ($mongorestore -is [System.Management.Automation.ApplicationInfo]) {
        & mongorestore --uri="$ATLAS_URI" --drop "$BACKUP_DIR/$LOCAL_DB"
    } else {
        & $mongorestore --uri="$ATLAS_URI" --drop "$BACKUP_DIR/$LOCAL_DB"
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Import thành công!" -ForegroundColor Green
    } else {
        Write-Host "❌ Import thất bại. Kiểm tra:" -ForegroundColor Red
        Write-Host "   - Connection string đúng chưa" -ForegroundColor Yellow
        Write-Host "   - Network Access trong Atlas đã cho phép IP của bạn chưa" -ForegroundColor Yellow
        Write-Host "   - Username/password đúng chưa" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "⚠️  Không tìm thấy thư mục backup." -ForegroundColor Yellow
    Write-Host "   Nếu bạn đã có dữ liệu trên Atlas, có thể bỏ qua bước này." -ForegroundColor Yellow
}

Write-Host "`n✅ Hoàn tất!" -ForegroundColor Green
Write-Host "`nBước tiếp theo:" -ForegroundColor Cyan
Write-Host "1. Đảm bảo Network Access trong MongoDB Atlas cho phép kết nối từ IP của bạn" -ForegroundColor Yellow
Write-Host "2. Restart Docker services: docker-compose restart" -ForegroundColor Yellow
Write-Host "3. Kiểm tra logs: docker-compose logs auth-service --tail 20" -ForegroundColor Yellow

