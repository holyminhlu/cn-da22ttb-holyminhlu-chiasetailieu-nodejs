# Script để export từ MongoDB local và import lên MongoDB Atlas
Write-Host "📦 Export và Import dữ liệu lên MongoDB Atlas" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Connection string MongoDB Atlas
$ATLAS_CONNECTION_STRING = "mongodb+srv://s7ludubai_db_user:0vlGxcs1X4IM9E7P@openlearnfoundation.du2nnrx.mongodb.net/OpenLearnFoundation"
$LOCAL_DB = "EduShareDB"
$ATLAS_DB = "OpenLearnFoundation"
$BACKUP_DIR = "./mongodb-backup"

Write-Host "`n📤 Bước 1: Export dữ liệu từ MongoDB local..." -ForegroundColor Yellow

# Kiểm tra MongoDB local có đang chạy không
$localMongo = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if (-not $localMongo) {
    Write-Host "⚠️  MongoDB local không chạy trên port 27017" -ForegroundColor Yellow
    Write-Host "   Đang thử export từ Docker MongoDB..." -ForegroundColor Yellow
    
    # Export từ Docker MongoDB
    if (Test-Path $BACKUP_DIR) {
        Remove-Item -Recurse -Force $BACKUP_DIR
    }
    
    docker-compose exec -T mongodb mongodump --db=$LOCAL_DB --archive > "$BACKUP_DIR/backup.archive" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Export từ Docker MongoDB thành công!" -ForegroundColor Green
    } else {
        Write-Host "❌ Không thể export. Vui lòng:" -ForegroundColor Red
        Write-Host "   1. Cài đặt MongoDB Database Tools" -ForegroundColor Yellow
        Write-Host "   2. Hoặc chạy MongoDB local trên port 27017" -ForegroundColor Yellow
        exit 1
    }
} else {
    # Export từ local MongoDB
    Write-Host "   Đang export từ MongoDB local..." -ForegroundColor Gray
    
    # Tìm mongodump trong các đường dẫn phổ biến
    $mongodumpPaths = @(
        "C:\Program Files\MongoDB\Server\*\bin\mongodump.exe",
        "C:\Program Files\MongoDB\Tools\*\bin\mongodump.exe",
        "$env:ProgramFiles\MongoDB\Server\*\bin\mongodump.exe"
    )
    
    $mongodump = $null
    foreach ($path in $mongodumpPaths) {
        $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $mongodump = $found.FullName
            break
        }
    }
    
    if (-not $mongodump) {
        Write-Host "❌ Không tìm thấy mongodump. Vui lòng:" -ForegroundColor Red
        Write-Host "   1. Cài đặt MongoDB Database Tools từ: https://www.mongodb.com/try/download/database-tools" -ForegroundColor Yellow
        Write-Host "   2. Hoặc thêm MongoDB bin vào PATH" -ForegroundColor Yellow
        Write-Host "`n   Đang thử export từ Docker MongoDB thay thế..." -ForegroundColor Yellow
        
        # Thử export từ Docker
        if (Test-Path $BACKUP_DIR) {
            Remove-Item -Recurse -Force $BACKUP_DIR
        }
        New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
        
        docker-compose exec -T mongodb mongodump --db=$LOCAL_DB --out=/tmp/backup 2>&1 | Out-Null
        docker cp "openlearn-mongodb:/tmp/backup/$LOCAL_DB" "$BACKUP_DIR/$LOCAL_DB" 2>&1 | Out-Null
        
        if (Test-Path "$BACKUP_DIR/$LOCAL_DB") {
            Write-Host "✅ Export từ Docker MongoDB thành công!" -ForegroundColor Green
        } else {
            Write-Host "❌ Không thể export. Vui lòng cài MongoDB Database Tools." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "   Tìm thấy mongodump tại: $mongodump" -ForegroundColor Gray
        
        if (Test-Path $BACKUP_DIR) {
            Remove-Item -Recurse -Force $BACKUP_DIR
        }
        
        & $mongodump --host=127.0.0.1:27017 --db=$LOCAL_DB --out=$BACKUP_DIR
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Export thành công!" -ForegroundColor Green
        } else {
            Write-Host "❌ Export thất bại." -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "`n📥 Bước 2: Import dữ liệu lên MongoDB Atlas..." -ForegroundColor Yellow

# Tìm mongorestore
$mongorestorePaths = @(
    "C:\Program Files\MongoDB\Server\*\bin\mongorestore.exe",
    "C:\Program Files\MongoDB\Tools\*\bin\mongorestore.exe",
    "$env:ProgramFiles\MongoDB\Tools\*\bin\mongorestore.exe"
)

$mongorestore = $null
foreach ($path in $mongorestorePaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $mongorestore = $found.FullName
        break
    }
}

if (-not $mongorestore) {
    Write-Host "❌ Không tìm thấy mongorestore." -ForegroundColor Red
    Write-Host "   Vui lòng cài MongoDB Database Tools từ:" -ForegroundColor Yellow
    Write-Host "   https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
    Write-Host "`n   Hoặc import thủ công bằng lệnh:" -ForegroundColor Yellow
    Write-Host "   mongorestore --uri=`"$ATLAS_CONNECTION_STRING`" `"$BACKUP_DIR\$LOCAL_DB`"" -ForegroundColor Gray
    exit 1
}

Write-Host "   Tìm thấy mongorestore tại: $mongorestore" -ForegroundColor Gray
Write-Host "   Đang import lên MongoDB Atlas..." -ForegroundColor Gray

# Import vào Atlas
if (Test-Path "$BACKUP_DIR/$LOCAL_DB") {
    & $mongorestore --uri="$ATLAS_CONNECTION_STRING" --drop "$BACKUP_DIR/$LOCAL_DB"
} else {
    Write-Host "❌ Không tìm thấy thư mục backup: $BACKUP_DIR/$LOCAL_DB" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Import lên MongoDB Atlas thành công!" -ForegroundColor Green
} else {
    Write-Host "❌ Import thất bại. Kiểm tra connection string và network access." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Hoan tat! Du lieu da duoc import len MongoDB Atlas." -ForegroundColor Green
Write-Host ""
Write-Host "Buoc tiep theo: Cap nhat docker-compose.yml de su dung MongoDB Atlas" -ForegroundColor Cyan
Write-Host "(docker-compose.yml da duoc cap nhat roi)" -ForegroundColor Gray

