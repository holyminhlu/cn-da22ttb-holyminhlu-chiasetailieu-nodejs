# 🚀 Docker Quick Start

## Chạy Dự Án với Docker

### Bước 1: Đảm bảo Docker đã được cài đặt

```bash
docker --version
docker-compose --version
```

### Bước 2: Chạy tất cả services

```bash
docker-compose up -d
```

### Bước 3: Kiểm tra services đã chạy

```bash
docker-compose ps
```

### Bước 4: Truy cập ứng dụng

- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:3000

## Các Lệnh Thường Dùng

```bash
# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down

# Restart services
docker-compose restart

# Rebuild images
docker-compose up -d --build
```

## Troubleshooting

Nếu gặp lỗi, xem file `DOCKER_SETUP.md` để biết chi tiết.

