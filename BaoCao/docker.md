# 🐳 Hướng Dẫn Docker - OpenLearnFoundation

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Docker](#cài-đặt-docker)
3. [Khởi Động Dự Án](#khởi-động-dự-án)
4. [Dừng Dự Án](#dừng-dự-án)
5. [Kiểm Tra Trạng Thái](#kiểm-tra-trạng-thái)
6. [Xem Logs](#xem-logs)
7. [Các Lệnh Hữu Ích](#các-lệnh-hữu-ích)
8. [Troubleshooting](#troubleshooting)
9. [Các Tình Huống Sử Dụng](#các-tình-huống-sử-dụng)

---

## Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

- **Docker Desktop** (Windows/Mac) hoặc **Docker Engine** (Linux)
- **Docker Compose** (thường đi kèm với Docker Desktop)
- **Git** (để clone repository)

### Tài Nguyên Hệ Thống

- **RAM**: Tối thiểu 4GB trống (khuyến nghị 8GB)
- **Ổ Cứng**: Tối thiểu 10GB dung lượng trống
- **CPU**: 2 cores trở lên (khuyến nghị 4 cores)

### Ports Cần Trống

Đảm bảo các ports sau không bị chiếm bởi ứng dụng khác:

- **3000**: API Gateway
- **3001**: Auth Service
- **3003**: Document Service
- **3004**: Course Service
- **3005**: Forum Service
- **3006**: Blog Service
- **8080**: Frontend
- **27017**: MongoDB (nếu dùng local MongoDB)

---

## Cài Đặt Docker

### Windows

1. Tải **Docker Desktop for Windows** từ: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. Đảm bảo Docker đang chạy (icon Docker trong system tray)

### Mac

1. Tải **Docker Desktop for Mac** từ: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. Kiểm tra Docker đang chạy

### Linux

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Khởi động Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Thêm user vào docker group (không cần sudo)
sudo usermod -aG docker $USER
# Logout và login lại
```

### Kiểm Tra Cài Đặt

```bash
# Kiểm tra Docker version
docker --version

# Kiểm tra Docker Compose version
docker-compose --version

# Kiểm tra Docker đang chạy
docker ps
```

---

## Khởi Động Dự Án

### Bước 1: Di Chuyển Vào Thư Mục Dự Án

```bash
cd OpenLearnFoundation
```

### Bước 2: Dừng Services Local (Nếu Có)

**⚠️ QUAN TRỌNG**: Nếu bạn đang chạy services local (npm start), cần dừng chúng trước:

#### Windows (PowerShell)

```powershell
# Dừng tất cả Node.js processes
taskkill /IM node.exe /F

# Dừng MongoDB local (nếu có)
net stop MongoDB
```

#### Mac/Linux

```bash
# Tìm và dừng Node.js processes
pkill -f node

# Dừng MongoDB local (nếu có)
sudo systemctl stop mongod
# hoặc
brew services stop mongodb-community
```

#### Kiểm Tra Ports Đã Trống

**Windows**:
```powershell
netstat -ano | findstr ":3000 :3001 :3003 :3004 :3005 :3006 :8080 :27017"
```

**Mac/Linux**:
```bash
lsof -i :3000 -i :3001 -i :3003 -i :3004 -i :3005 -i :3006 -i :8080 -i :27017
```

Nếu không có output, ports đã trống.

### Bước 3: Khởi Động Tất Cả Services

```bash
docker-compose up -d
```

**Giải thích lệnh**:
- `docker-compose up`: Khởi động tất cả services
- `-d`: Chạy ở chế độ **detached** (background), không chiếm terminal

**Lần đầu chạy**, Docker sẽ:
1. Tải các images cần thiết (MongoDB, Node.js)
2. Build images cho các services (auth, course, document, blog, forum, api-gateway, frontend)
3. Tạo network `openlearn-network`
4. Tạo volume `mongodb_data`
5. Khởi động tất cả containers

**Thời gian**: Lần đầu có thể mất 5-10 phút tùy tốc độ internet và máy tính.

### Bước 4: Kiểm Tra Services Đã Khởi Động

```bash
docker-compose ps
```

**Kết quả mong đợi**: Tất cả services có status `Up` (healthy):

```
NAME                      STATUS
openlearn-mongodb         Up (healthy)
openlearn-auth-service    Up (healthy)
openlearn-course-service  Up (healthy)
openlearn-document-service Up (healthy)
openlearn-blog-service    Up (healthy)
openlearn-forum-service   Up (healthy)
openlearn-api-gateway     Up (healthy)
openlearn-frontend        Up (healthy)
```

### Bước 5: Truy Cập Ứng Dụng

Sau khi tất cả services đã khởi động (khoảng 30-60 giây), truy cập:

- **🌐 Frontend**: http://localhost:8080
- **🔌 API Gateway**: http://localhost:3000
- **🔐 Auth Service**: http://localhost:3001
- **📄 Document Service**: http://localhost:3003
- **📚 Course Service**: http://localhost:3004
- **💬 Forum Service**: http://localhost:3005
- **📝 Blog Service**: http://localhost:3006
- **🗄️ MongoDB**: localhost:27017

---

## Dừng Dự Án

### Cách 1: Dừng Nhưng Giữ Containers (Khuyên Dùng)

```bash
docker-compose stop
```

**Lợi ích**:
- Dừng tất cả services nhưng giữ containers
- Dữ liệu không bị mất
- Khởi động lại nhanh hơn

**Khởi động lại**:
```bash
docker-compose start
```

### Cách 2: Dừng Và Xóa Containers

```bash
docker-compose down
```

**Lợi ích**:
- Dừng và xóa containers
- Giữ lại images và volumes (dữ liệu không mất)
- Giải phóng ports

**Khởi động lại**:
```bash
docker-compose up -d
```

### Cách 3: Dừng Và Xóa Tất Cả (Cẩn Thận!)

```bash
docker-compose down -v
```

**⚠️ CẢNH BÁO**: 
- Xóa cả **volumes** (dữ liệu MongoDB sẽ bị mất!)
- Chỉ dùng khi muốn reset hoàn toàn

**Khởi động lại**:
```bash
docker-compose up -d
```

### Cách 4: Dừng Một Service Cụ Thể

```bash
# Dừng frontend
docker-compose stop frontend

# Dừng auth-service
docker-compose stop auth-service

# Dừng nhiều services
docker-compose stop frontend api-gateway
```

**Khởi động lại service**:
```bash
docker-compose start frontend
```

---

## Kiểm Tra Trạng Thái

### Xem Trạng Thái Tất Cả Services

```bash
docker-compose ps
```

**Output mẫu**:
```
NAME                      COMMAND                  STATUS
openlearn-mongodb         "docker-entrypoint.sh"   Up 2 hours (healthy)
openlearn-auth-service    "node index.js"          Up 2 hours (healthy)
openlearn-frontend        "nginx -g 'daemon off;'"  Up 2 hours (healthy)
...
```

### Xem Chi Tiết Một Service

```bash
# Xem thông tin chi tiết
docker-compose ps api-gateway

# Hoặc dùng docker inspect
docker inspect openlearn-api-gateway
```

### Kiểm Tra Health Check

```bash
# Kiểm tra health của tất cả services
docker-compose ps | grep healthy

# Kiểm tra health của một service
docker inspect openlearn-api-gateway | grep -A 10 Health
```

### Xem Resource Usage

```bash
# Xem CPU, RAM usage của tất cả containers
docker stats

# Xem resource của một container cụ thể
docker stats openlearn-api-gateway
```

---

## Xem Logs

### Xem Logs Tất Cả Services

```bash
# Xem logs real-time
docker-compose logs -f

# Xem logs với timestamp
docker-compose logs -f -t

# Xem 100 dòng logs gần nhất
docker-compose logs --tail=100
```

### Xem Logs Một Service Cụ Thể

```bash
# Logs của API Gateway
docker-compose logs -f api-gateway

# Logs của Auth Service
docker-compose logs -f auth-service

# Logs của Frontend
docker-compose logs -f frontend

# Logs của MongoDB
docker-compose logs -f mongodb
```

### Xem Logs Với Filter

```bash
# Chỉ xem logs có chứa "error"
docker-compose logs | grep -i error

# Xem logs của nhiều services
docker-compose logs -f api-gateway auth-service
```

### Lưu Logs Ra File

```bash
# Lưu logs vào file
docker-compose logs > docker-logs.txt

# Lưu logs của một service
docker-compose logs api-gateway > api-gateway-logs.txt
```

---

## Các Lệnh Hữu Ích

### Restart Services

```bash
# Restart tất cả services
docker-compose restart

# Restart một service cụ thể
docker-compose restart api-gateway

# Restart nhiều services
docker-compose restart auth-service course-service
```

### Rebuild Images

```bash
# Rebuild tất cả images (khi code thay đổi)
docker-compose build

# Rebuild một service cụ thể
docker-compose build api-gateway

# Rebuild và restart ngay
docker-compose up -d --build

# Rebuild không cache (clean build)
docker-compose build --no-cache
```

### Vào Container (Shell Access)

```bash
# Vào container của API Gateway
docker-compose exec api-gateway sh

# Vào container của Auth Service
docker-compose exec auth-service sh

# Vào MongoDB shell
docker-compose exec mongodb mongosh

# Vào container với bash (nếu có)
docker-compose exec api-gateway bash
```

### Xem Thông Tin Network

```bash
# Xem network details
docker network inspect openlearn-network

# Xem tất cả networks
docker network ls
```

### Xem Thông Tin Volumes

```bash
# Xem tất cả volumes
docker volume ls

# Xem chi tiết volume
docker volume inspect openlearnfoundation_mongodb_data
```

### Xóa Tất Cả (Clean Up)

```bash
# Dừng và xóa containers, networks
docker-compose down

# Xóa cả volumes (⚠️ mất dữ liệu)
docker-compose down -v

# Xóa cả images
docker-compose down --rmi all

# Xóa tất cả (containers, networks, volumes, images)
docker-compose down -v --rmi all
```

### Xem Images

```bash
# Xem tất cả images
docker images

# Xóa một image
docker rmi openlearnfoundation_api-gateway

# Xóa tất cả unused images
docker image prune -a
```

---

## Troubleshooting

### 1. Service Không Khởi Động

**Triệu chứng**: Service có status `Exit` hoặc `Restarting`

**Giải pháp**:

```bash
# Xem logs để tìm lỗi
docker-compose logs [service-name]

# Kiểm tra ports có bị conflict không
netstat -ano | findstr ":3000"  # Windows
lsof -i :3000                   # Mac/Linux

# Restart service
docker-compose restart [service-name]

# Rebuild service
docker-compose up -d --build [service-name]
```

### 2. MongoDB Connection Error

**Triệu chứng**: Services không kết nối được MongoDB

**Giải pháp**:

```bash
# Kiểm tra MongoDB đã khởi động chưa
docker-compose ps mongodb

# Xem logs MongoDB
docker-compose logs mongodb

# Đợi MongoDB khởi động hoàn toàn (10-30 giây)
# Sau đó restart các services
docker-compose restart auth-service course-service document-service
```

### 3. Port Đã Bị Chiếm

**Triệu chứng**: `Error: bind: address already in use`

**Giải pháp**:

**Windows**:
```powershell
# Tìm process đang dùng port
netstat -ano | findstr ":3000"

# Dừng process (thay PID bằng số thực tế)
taskkill /PID [PID] /F
```

**Mac/Linux**:
```bash
# Tìm process đang dùng port
lsof -i :3000

# Dừng process (thay PID bằng số thực tế)
kill -9 [PID]
```

### 4. Frontend Không Kết Nối Được API

**Triệu chứng**: Frontend load nhưng API calls fail

**Giải pháp**:

```bash
# Kiểm tra API Gateway
curl http://localhost:3000

# Kiểm tra logs API Gateway
docker-compose logs api-gateway

# Kiểm tra network
docker network inspect openlearn-network

# Restart API Gateway
docker-compose restart api-gateway
```

### 5. Upload Files Không Hoạt Động

**Triệu chứng**: Upload files bị lỗi

**Giải pháp**:

```bash
# Kiểm tra volumes được mount đúng chưa
docker-compose exec document-service ls -la /app/uploads

# Kiểm tra permissions
docker-compose exec document-service chmod -R 777 /app/uploads

# Xem logs
docker-compose logs document-service
```

### 6. Images Không Build Được

**Triệu chứng**: `ERROR: failed to build`

**Giải pháp**:

```bash
# Rebuild không cache
docker-compose build --no-cache

# Xem logs chi tiết
docker-compose build --progress=plain

# Xóa images cũ và rebuild
docker-compose down --rmi all
docker-compose build
```

### 7. Out of Memory

**Triệu chứng**: Containers bị kill hoặc chậm

**Giải pháp**:

```bash
# Xem resource usage
docker stats

# Giảm số lượng services chạy
# Chỉ chạy services cần thiết
docker-compose up -d mongodb api-gateway frontend

# Tăng Docker memory limit trong Docker Desktop settings
```

### 8. Services Không Healthy

**Triệu chứng**: Status là `Up` nhưng không `healthy`

**Giải pháp**:

```bash
# Xem health check details
docker inspect [container-name] | grep -A 20 Health

# Kiểm tra health check endpoint
docker-compose exec api-gateway wget -O- http://localhost:3000/test

# Restart service
docker-compose restart [service-name]
```

---

## Các Tình Huống Sử Dụng

### Tình Huống 1: Khởi Động Lần Đầu

```bash
# 1. Di chuyển vào thư mục
cd OpenLearnFoundation

# 2. Dừng services local (nếu có)
taskkill /IM node.exe /F  # Windows
# hoặc
pkill -f node              # Mac/Linux

# 3. Khởi động Docker
docker-compose up -d

# 4. Đợi services khởi động (30-60 giây)
docker-compose ps

# 5. Truy cập http://localhost:8080
```

### Tình Huống 2: Khởi Động Lại Sau Khi Đã Dừng

```bash
# Nếu đã dùng docker-compose stop
docker-compose start

# Nếu đã dùng docker-compose down
docker-compose up -d
```

### Tình Huống 3: Code Thay Đổi, Cần Rebuild

```bash
# Rebuild và restart
docker-compose up -d --build

# Hoặc rebuild một service cụ thể
docker-compose up -d --build api-gateway
```

### Tình Huống 4: Chỉ Chạy Một Số Services

```bash
# Chỉ chạy MongoDB và API Gateway
docker-compose up -d mongodb api-gateway

# Chỉ chạy backend services (không có frontend)
docker-compose up -d mongodb auth-service course-service document-service api-gateway
```

### Tình Huống 5: Development Mode (Hot Reload)

**Cách 1**: Chạy Docker cho backend, frontend chạy local

```bash
# Chạy backend services trong Docker
docker-compose up -d mongodb auth-service course-service document-service api-gateway

# Chạy frontend local (trong terminal khác)
cd client/olf
npm run serve
```

**Cách 2**: Mount source code vào containers (cần cấu hình thêm trong docker-compose.yml)

### Tình Huống 6: Reset Hoàn Toàn

```bash
# ⚠️ CẢNH BÁO: Xóa tất cả dữ liệu
docker-compose down -v --rmi all

# Khởi động lại từ đầu
docker-compose up -d
```

### Tình Huống 7: Debug Một Service

```bash
# 1. Xem logs
docker-compose logs -f [service-name]

# 2. Vào container
docker-compose exec [service-name] sh

# 3. Kiểm tra network
docker network inspect openlearn-network

# 4. Test endpoint
docker-compose exec [service-name] wget -O- http://localhost:[port]/test
```

### Tình Huống 8: Backup Dữ Liệu

```bash
# Backup MongoDB data
docker-compose exec mongodb mongodump --out /data/backup

# Copy backup ra host
docker cp openlearn-mongodb:/data/backup ./mongodb-backup
```

### Tình Huống 9: Update Code và Deploy

```bash
# 1. Pull code mới
git pull

# 2. Rebuild images
docker-compose build

# 3. Restart services
docker-compose up -d

# 4. Kiểm tra logs
docker-compose logs -f
```

---

## Quick Reference

### Lệnh Thường Dùng

```bash
# Khởi động
docker-compose up -d

# Dừng
docker-compose stop

# Dừng và xóa
docker-compose down

# Restart
docker-compose restart

# Xem logs
docker-compose logs -f

# Xem trạng thái
docker-compose ps

# Rebuild
docker-compose up -d --build

# Vào container
docker-compose exec [service] sh
```

### Services và Ports

| Service | Container Name | Port | URL |
|---------|---------------|------|-----|
| Frontend | openlearn-frontend | 8080 | http://localhost:8080 |
| API Gateway | openlearn-api-gateway | 3000 | http://localhost:3000 |
| Auth Service | openlearn-auth-service | 3001 | http://localhost:3001 |
| Document Service | openlearn-document-service | 3003 | http://localhost:3003 |
| Course Service | openlearn-course-service | 3004 | http://localhost:3004 |
| Forum Service | openlearn-forum-service | 3005 | http://localhost:3005 |
| Blog Service | openlearn-blog-service | 3006 | http://localhost:3006 |
| MongoDB | openlearn-mongodb | 27017 | localhost:27017 |

---

## Checklist

### Trước Khi Khởi Động

- [ ] Docker đã được cài đặt và đang chạy
- [ ] Đã dừng tất cả services local (nếu có)
- [ ] Ports 3000, 3001, 3003, 3004, 3005, 3006, 8080, 27017 đã trống
- [ ] Đã di chuyển vào thư mục `OpenLearnFoundation`

### Sau Khi Khởi Động

- [ ] Tất cả services có status `Up (healthy)`
- [ ] Frontend truy cập được tại http://localhost:8080
- [ ] API Gateway truy cập được tại http://localhost:3000
- [ ] Không có lỗi trong logs

### Khi Gặp Vấn Đề

- [ ] Đã xem logs: `docker-compose logs -f`
- [ ] Đã kiểm tra ports: `netstat` hoặc `lsof`
- [ ] Đã kiểm tra trạng thái: `docker-compose ps`
- [ ] Đã thử restart: `docker-compose restart`

---

## Lưu Ý Quan Trọng

1. **Không chạy đồng thời local services và Docker** vì sẽ conflict ports
2. **Lần đầu chạy** sẽ mất thời gian để build images (5-10 phút)
3. **Dữ liệu MongoDB** được lưu trong volume, không mất khi restart
4. **Upload files** được mount từ host, không mất khi restart containers
5. **Health checks** có thể mất 30-60 giây để pass
6. **Network** `openlearn-network` cho phép các services giao tiếp với nhau

---

## Tài Liệu Tham Khảo

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Image](https://hub.docker.com/_/node)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**Tài liệu được cập nhật lần cuối: 2024-01-15**

**Ghi chú**: Nếu gặp vấn đề không được giải quyết trong tài liệu này, vui lòng xem logs chi tiết và kiểm tra các file cấu hình Docker.

