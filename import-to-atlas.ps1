# Script de import du lieu len MongoDB Atlas
Write-Host "Import Du Lieu Len MongoDB Atlas" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$ATLAS_URI = "mongodb+srv://s7ludubai_db_user:0vlGxcs1X4IM9E7P@openlearnfoundation.du2nnrx.mongodb.net/OpenLearnFoundation"
$LOCAL_DB = "EduShareDB"
$BACKUP_DIR = "./mongodb-backup"

Write-Host ""
Write-Host "Buoc 1: Export tu MongoDB Local..." -ForegroundColor Yellow

# Kiem tra MongoDB local
$localRunning = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue

if ($localRunning) {
    Write-Host "MongoDB local dang chay. Dang export..." -ForegroundColor Gray
    
    # Tim mongodump
    $mongodump = Get-Command mongodump -ErrorAction SilentlyContinue
    if (-not $mongodump) {
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
            Write-Host "Export thanh cong!" -ForegroundColor Green
        } else {
            Write-Host "Export that bai. Kiem tra MongoDB local co du lieu khong." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Khong tim thay mongodump." -ForegroundColor Yellow
        Write-Host "Vui long cai MongoDB Database Tools:" -ForegroundColor Yellow
        Write-Host "https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Hoac import thu cong bang MongoDB Compass" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "MongoDB local khong chay." -ForegroundColor Yellow
    Write-Host "Neu ban da co du lieu tren MongoDB Atlas, bo qua buoc nay." -ForegroundColor Yellow
    $skip = Read-Host "Bo qua export va chi import? (y/n)"
    if ($skip -ne "y") {
        exit 0
    }
}

Write-Host ""
Write-Host "Buoc 2: Import len MongoDB Atlas..." -ForegroundColor Yellow

# Tim mongorestore
$mongorestore = Get-Command mongorestore -ErrorAction SilentlyContinue
if (-not $mongorestore) {
    $mongorestorePath = Get-ChildItem -Path "C:\Program Files\MongoDB" -Recurse -Filter "mongorestore.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($mongorestorePath) {
        $mongorestore = $mongorestorePath.FullName
    }
}

if (-not $mongorestore) {
    Write-Host "Khong tim thay mongorestore." -ForegroundColor Red
    Write-Host "Vui long cai MongoDB Database Tools:" -ForegroundColor Yellow
    Write-Host "https://www.mongodb.com/try/download/database-tools" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Hoac import thu cong bang MongoDB Compass:" -ForegroundColor Yellow
    Write-Host "1. Mo MongoDB Compass" -ForegroundColor Gray
    Write-Host "2. Ket noi: $ATLAS_URI" -ForegroundColor Gray
    Write-Host "3. Import tu file hoac collection" -ForegroundColor Gray
    exit 1
}

if (Test-Path "$BACKUP_DIR/$LOCAL_DB") {
    Write-Host "Dang import..." -ForegroundColor Gray
    
    if ($mongorestore -is [System.Management.Automation.ApplicationInfo]) {
        & mongorestore --uri="$ATLAS_URI" --drop "$BACKUP_DIR/$LOCAL_DB"
    } else {
        & $mongorestore --uri="$ATLAS_URI" --drop "$BACKUP_DIR/$LOCAL_DB"
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Import thanh cong!" -ForegroundColor Green
    } else {
        Write-Host "Import that bai. Kiem tra:" -ForegroundColor Red
        Write-Host "- Connection string dung chua" -ForegroundColor Yellow
        Write-Host "- Network Access trong Atlas da cho phep IP cua ban chua" -ForegroundColor Yellow
        Write-Host "- Username/password dung chua" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "Khong tim thay thu muc backup." -ForegroundColor Yellow
    Write-Host "Neu ban da co du lieu tren Atlas, co the bo qua buoc nay." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Hoan tat!" -ForegroundColor Green
Write-Host ""
Write-Host "Buoc tiep theo:" -ForegroundColor Cyan
Write-Host "1. Dam bao Network Access trong MongoDB Atlas cho phep ket noi tu IP cua ban" -ForegroundColor Yellow
Write-Host "2. Restart Docker services: docker-compose restart" -ForegroundColor Yellow
Write-Host "3. Kiem tra logs: docker-compose logs auth-service --tail 20" -ForegroundColor Yellow

