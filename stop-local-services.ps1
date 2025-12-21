# Script để dừng tất cả local services trước khi chạy Docker
Write-Host "🛑 Đang dừng tất cả local services..." -ForegroundColor Yellow

# Dừng tất cả Node.js processes
Write-Host "`nĐang dừng Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  - Dừng process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Đã dừng tất cả Node.js processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Không tìm thấy Node.js processes nào đang chạy" -ForegroundColor Yellow
}

# Dừng MongoDB nếu đang chạy
Write-Host "`nĐang kiểm tra MongoDB..." -ForegroundColor Cyan
$mongoProcesses = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcesses) {
    $mongoProcesses | ForEach-Object {
        Write-Host "  - Dừng MongoDB process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Đã dừng MongoDB processes" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Không tìm thấy MongoDB processes nào đang chạy" -ForegroundColor Yellow
}

# Kiểm tra ports
Write-Host "`nĐang kiểm tra ports..." -ForegroundColor Cyan
$ports = @(3000, 3001, 3003, 3004, 3005, 3006, 8080, 27017)
$occupiedPorts = @()

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $occupiedPorts += $port
        Write-Host "  ⚠️  Port $port vẫn đang được sử dụng" -ForegroundColor Red
    }
}

if ($occupiedPorts.Count -eq 0) {
    Write-Host "`n✅ Tất cả ports đã trống! Bạn có thể chạy Docker bây giờ." -ForegroundColor Green
    Write-Host "`nChạy lệnh: docker-compose up -d" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Vẫn còn một số ports đang được sử dụng:" -ForegroundColor Yellow
    $occupiedPorts | ForEach-Object { Write-Host "  - Port $_" -ForegroundColor Red }
    Write-Host "`nVui lòng kiểm tra và dừng các services đang sử dụng các ports này." -ForegroundColor Yellow
}

Write-Host "`n✨ Hoàn tất!" -ForegroundColor Green

