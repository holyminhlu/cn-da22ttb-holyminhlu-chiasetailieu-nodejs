# 👀 Cách Xem MongoDB Data Ngay Bây Giờ

## 🚀 Phương Pháp Nhanh Nhất

### **Bước 1: Mở MongoDB Atlas**
```
https://cloud.mongodb.com/
```

### **Bước 2: Đăng nhập**
- Email: (tài khoản bạn dùng để tạo Atlas)
- Password: (password của Atlas account)

### **Bước 3: Chọn Cluster**
- Click vào cluster: **`clustercheaptrip`**

### **Bước 4: Browse Collections**
1. Click nút **"Browse Collections"** (màu xanh)
2. Chọn database: `CheapTripDB` hoặc `ToursCheapTripDB`
3. Click vào collection: `UserCollection` hoặc `ToursCollection`
4. Xem các documents bên trong

---

## 🎯 Chi Tiết Các Bước

### **Trên MongoDB Atlas Website:**

1. **Dashboard** → Click vào cluster "clustercheaptrip"
2. **Database** tab → Click "Browse Collections"
3. **Databases list** → Click vào `CheapTripDB`
4. **Collections list** → Click vào `UserCollection`
5. **Documents** → Xem danh sách users

**Screenshot locations:**
- Left sidebar: Databases → Browse Collections button
- Main area: List of databases
- Click database → List of collections
- Click collection → List of documents

---

## 📊 Xem Dữ Liệu Mẫu

### **UserCollection** (trong CheapTripDB)
```
Documents trong collection:
- fullName
- email  
- passWord (hashed)
- phone
- address
- gender
- created_at
- updated_at
```

### **ToursCollection** (trong ToursCheapTripDB)
```
Documents trong collection:
- tour_id
- name
- type
- image_url
- price_per_adult
- price_per_children
- review_count
- average_rating
- duration
- departure_date
- departure_location
- destination
- hotel
- transportation
- available_slots
```

---

## 🔧 Troubleshooting

### **Không thấy nút "Browse Collections"**
- Đảm bảo đã click vào cluster đúng
- Roll down trang xuống

### **Không có dữ liệu**
- Collections có thể trống
- Thử tạo data mới bằng code

### **Không login được**
- Check email/password
- Dùng forgot password

---

## 🎬 Video Demo (Tự làm)

Nếu cần, tôi có thể:
1. Tạo script để insert sample data
2. Tạo screenshot hướng dẫn
3. Giải thích các fields

**Bạn muốn tạo sample data để thấy ngay kết quả không?**



