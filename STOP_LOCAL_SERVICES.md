# 🛑 Hướng Dẫn Dừng Services Local Trước Khi Chạy Docker

## Vấn Đề

Khi chạy Docker, các ports sau đang bị chiếm bởi services local:
- **Port 3000**: API Gateway (PID: 27040)
- **Port 3001**: Auth Service (PID: 26712)
- **Port 3003**: Document Service (PID: 11760)
- **Port 3004**: Course Service (PID: 24516)
- **Port 3005**: Forum Service (PID: 25396)
- **Port 3006**: Blog Service (PID: 28568)
- **Port 8080**: Frontend (PID: 28416)
- **Port 27017**: MongoDB (PID: 25932, 5008)

## Giải Pháp

### Cách 1: Dừng Services Thủ Công (Khuyên dùng)

1. **Tìm và đóng các terminal windows đang chạy services**
   - Tìm các cửa sổ terminal/command prompt đang chạy `npm start` hoặc `node index.js`
   - Nhấn `Ctrl+C` trong mỗi cửa sổ để dừng service

2. **Hoặc đóng các process bằng Task Manager**
   - Mở Task Manager (Ctrl+Shift+Esc)
   - Tìm các process Node.js
   - End Task các process đang chạy

### Cách 2: Dừng Services Bằng Command Line

```powershell
# Dừng Document Service (port 3003)
taskkill /PID 11760 /F

# Dừng API Gateway (port 3000)
taskkill /PID 27040 /F

# Dừng Auth Service (port 3001)
taskkill /PID 26712 /F

# Dừng Course Service (port 3004)
taskkill /PID 24516 /F

# Dừng Forum Service (port 3005)
taskkill /PID 25396 /F

# Dừng Blog Service (port 3006)
taskkill /PID 28568 /F

# Dừng Frontend (port 8080)
taskkill /PID 28416 /F
```

### Cách 3: Dừng Tất Cả Node.js Processes

```powershell
# Dừng tất cả Node.js processes (CẨN THẬN - sẽ dừng tất cả Node apps)
taskkill /IM node.exe /F
```

### Cách 4: Dừng MongoDB Local (nếu cần)

Nếu bạn đang chạy MongoDB local và muốn dùng MongoDB trong Docker:

```powershell
# Dừng MongoDB service
net stop MongoDB

# Hoặc nếu chạy như process
taskkill /PID 25932 /F
taskkill /PID 5008 /F
```

## Sau Khi Dừng Services

1. **Kiểm tra lại ports đã trống:**
   ```powershell
   netstat -ano | findstr ":3000 :3001 :3003 :3004 :3005 :3006 :8080"
   ```

2. **Chạy Docker:**
   ```powershell
   docker-compose up -d
   ```

## Lưu Ý

- **Không nên chạy cả local services và Docker cùng lúc** vì sẽ conflict ports
- **Chọn một trong hai:**
  - Chạy local (npm start trong từng service)
  - Hoặc chạy Docker (docker-compose up -d)
- **Nếu muốn development với hot-reload**, chạy local services
- **Nếu muốn test production-like environment**, chạy Docker

## Quick Command để Dừng Tất Cả

```powershell
# Dừng tất cả Node.js và MongoDB processes
taskkill /IM node.exe /F
taskkill /IM mongod.exe /F
```

Sau đó chạy Docker:
```powershell
docker-compose up -d
```

