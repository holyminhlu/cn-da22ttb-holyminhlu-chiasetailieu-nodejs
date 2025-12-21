# 🐳 Docker Setup Guide - OpenLearnFoundation

Hướng dẫn chạy toàn bộ dự án OpenLearnFoundation bằng Docker.

## 📋 Yêu Cầu

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose (thường đi kèm với Docker Desktop)
- Ít nhất 4GB RAM trống
- Ít nhất 10GB dung lượng ổ cứng

## 🚀 Cách Chạy

### 1. Clone và Di Chuyển vào Thư Mục Dự Án

```bash
cd OpenLearnFoundation
```

### 2. Chạy Tất Cả Services

```bash
docker-compose up -d
```

Lệnh này sẽ:
- Build tất cả Docker images
- Tạo và khởi động tất cả containers
- Tạo network và volumes cần thiết
- Chạy tất cả services ở chế độ background (`-d`)

### 3. Xem Logs

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của một service cụ thể
docker-compose logs -f api-gateway
docker-compose logs -f auth-service
docker-compose logs -f frontend
```

### 4. Kiểm Tra Trạng Thái

```bash
docker-compose ps
```

### 5. Dừng Services

```bash
# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes (xóa dữ liệu MongoDB)
docker-compose down -v
```

## 🌐 Truy Cập Services

Sau khi chạy `docker-compose up -d`, các services sẽ có sẵn tại:

- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Document Service**: http://localhost:3003
- **Course Service**: http://localhost:3004
- **Forum Service**: http://localhost:3005
- **Blog Service**: http://localhost:3006
- **MongoDB**: localhost:27017

## 📁 Cấu Trúc Services

### Services trong Docker:

1. **mongodb**: MongoDB database server
2. **auth-service**: Authentication service
3. **course-service**: Course management service
4. **document-service**: Document management service
5. **blog-service**: Blog posts service
6. **forum-service**: Forum/social feed service
7. **api-gateway**: API Gateway (routes requests to services)
8. **frontend**: Vue.js frontend application

## 🔧 Cấu Hình

### Environment Variables

Các biến môi trường được định nghĩa trong `docker-compose.yml`. Để thay đổi:

1. Tạo file `.env` ở thư mục gốc (dựa trên `.env.example`)
2. Cập nhật các giá trị cần thiết
3. Chạy lại: `docker-compose up -d`

### Volumes

- **mongodb_data**: Lưu trữ dữ liệu MongoDB
- **uploads**: Các thư mục uploads được mount từ host để dữ liệu không bị mất khi restart

### Networks

Tất cả services được kết nối qua network `openlearn-network` để có thể giao tiếp với nhau.

## 🔄 Các Lệnh Hữu Ích

### Rebuild Images

```bash
# Rebuild tất cả images
docker-compose build

# Rebuild một service cụ thể
docker-compose build api-gateway

# Rebuild và restart
docker-compose up -d --build
```

### Restart Services

```bash
# Restart tất cả
docker-compose restart

# Restart một service
docker-compose restart auth-service
```

### Xem Resource Usage

```bash
docker stats
```

### Vào Container

```bash
# Vào container của một service
docker-compose exec auth-service sh
docker-compose exec mongodb mongosh
```

### Xóa Tất Cả

```bash
# Dừng và xóa containers, networks
docker-compose down

# Dừng, xóa containers, networks và volumes
docker-compose down -v

# Xóa images
docker-compose down --rmi all
```

## 🐛 Troubleshooting

### Service không khởi động

1. Kiểm tra logs: `docker-compose logs [service-name]`
2. Kiểm tra MongoDB đã sẵn sàng: `docker-compose logs mongodb`
3. Kiểm tra ports có bị conflict không: `netstat -an | grep [port]`

### MongoDB Connection Error

1. Đảm bảo MongoDB container đã khởi động: `docker-compose ps`
2. Kiểm tra health check: `docker-compose logs mongodb`
3. Đợi MongoDB khởi động hoàn toàn (có thể mất 10-30 giây)

### Frontend không kết nối được API

1. Kiểm tra API Gateway: http://localhost:3000
2. Kiểm tra CORS settings trong các services
3. Kiểm tra network: `docker network inspect openlearn-network`

### Upload Files không hoạt động

1. Kiểm tra volumes được mount đúng chưa
2. Kiểm tra permissions của thư mục uploads
3. Xem logs của service có upload: `docker-compose logs document-service`

## 📝 Development Mode

Để phát triển với hot-reload, bạn có thể:

1. Chạy services trong Docker
2. Chạy frontend local với `npm run serve` (sẽ proxy đến API Gateway trong Docker)
3. Hoặc mount source code vào containers (cần cấu hình thêm)

## 🔒 Production Deployment

Cho production:

1. Sử dụng MongoDB Atlas thay vì local MongoDB
2. Cập nhật `MONGODB_URI` trong `.env`
3. Sử dụng reverse proxy (nginx) cho frontend
4. Bật HTTPS
5. Cấu hình resource limits trong `docker-compose.yml`
6. Sử dụng Docker secrets cho sensitive data

## 📚 Tài Liệu Thêm

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Image](https://hub.docker.com/_/node)

## ✅ Checklist

- [ ] Docker và Docker Compose đã cài đặt
- [ ] Ports 3000, 3001, 3003, 3004, 3005, 3006, 8080, 27017 không bị chiếm
- [ ] Đã chạy `docker-compose up -d`
- [ ] Tất cả services đã khởi động (kiểm tra bằng `docker-compose ps`)
- [ ] Frontend truy cập được tại http://localhost:8080
- [ ] API Gateway truy cập được tại http://localhost:3000

---

**Happy Coding! 🚀**

