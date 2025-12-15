# ✅ Test Checklist - Payment API Timeout Fix

## 🎯 Mục Tiêu

- ✅ API `/api/payments` trả response trong < 1 giây (mock) hoặc < 15 giây (real SePay)
- ✅ Không còn lỗi ECONNABORTED
- ✅ Frontend nhận được JSON response hợp lệ
- ✅ Payment được tạo trong database
- ✅ User được redirect đến payment URL

## 📋 Test Checklist

### 1. Postman Test - Basic Request

**Request:**
```http
POST http://localhost:3000/api/payments
Content-Type: application/json

{
  "course_id": "test_course_id",
  "user_id": "test_user_id"
}
```

**Expected:**
- ✅ Status: 200 OK hoặc 400/401/404 với message rõ ràng
- ✅ Response time: < 1 second (nếu mock) hoặc < 15 seconds (nếu real SePay)
- ✅ Response có `success` field
- ✅ Nếu success: có `data.payment_url`

**Check:**
- [ ] Request không bị timeout
- [ ] Response có JSON format hợp lệ
- [ ] Error message rõ ràng (nếu có lỗi)

---

### 2. Postman Test - Missing Fields

**Test 2.1: Missing course_id**
```json
{
  "user_id": "test_user_id"
}
```
**Expected:** 400 Bad Request với message "course_id là bắt buộc"

**Test 2.2: Missing user_id**
```json
{
  "course_id": "test_course_id"
}
```
**Expected:** 401 Unauthorized với message "Người dùng chưa đăng nhập"

**Test 2.3: Invalid course_id**
```json
{
  "course_id": "invalid_course_id",
  "user_id": "test_user_id"
}
```
**Expected:** 404 Not Found với message "Khóa học không tồn tại"

**Check:**
- [ ] Tất cả test cases trả về response (không timeout)
- [ ] Error messages rõ ràng
- [ ] Status codes đúng

---

### 3. Browser Test - Full Flow

**Steps:**
1. Open browser DevTools → Network tab
2. Navigate to course page với giá 5000 VND
3. Click "Đăng ký" button
4. Monitor network request

**Expected:**
- ✅ Request: `POST /api/payments`
- ✅ Status: 200 OK
- ✅ Response time: < 1 second (mock) hoặc < 15 seconds (real)
- ✅ Response có `payment_url`
- ✅ Browser redirect đến payment URL

**Check:**
- [ ] Request không bị timeout
- [ ] Response nhận được trong thời gian hợp lý
- [ ] Redirect hoạt động đúng

---

### 4. Backend Logs Check

**Check logs khi test:**

```
✅ [CHECKPOINT 1] CREATE PAYMENT REQUEST
✅ [CHECKPOINT 2] Course found: ...
✅ [CHECKPOINT 3] Price: 5000 VND
✅ [CHECKPOINT 4] No existing enrollment
✅ [CHECKPOINT 5] No pending payment
✅ [CHECKPOINT 6] Payment created: payment_...
✅ [CHECKPOINT 7] SePay response in XXXms
✅ [CHECKPOINT 8] Payment updated
✅ [CHECKPOINT 9] Payment created successfully in XXXms
```

**Check:**
- [ ] Tất cả checkpoints được log
- [ ] Không có checkpoint nào bị treo
- [ ] Total time < 1 second (mock) hoặc < 15 seconds (real)

---

### 5. Database Check

**After successful payment creation:**

```javascript
// MongoDB
use EduShareDB
db.Payments.find({ 
  user_id: "test_user_id",
  course_id: "test_course_id"
}).pretty()
```

**Expected:**
- ✅ Payment record được tạo
- ✅ `status`: "processing"
- ✅ `sepay_payment_url`: có giá trị
- ✅ `amount`: 5000
- ✅ `currency`: "VND"

**Check:**
- [ ] Payment record tồn tại
- [ ] Data đúng format
- [ ] Timestamps được set

---

### 6. Timeout Test

**Simulate timeout:**
- Block SePay API call (hoặc dùng invalid API key)
- Test với SePay service không phản hồi

**Expected:**
- ✅ Response trong 15 seconds (timeout)
- ✅ Error message: "SePay service không phản hồi kịp thời"
- ✅ Status: 500
- ✅ Payment record được cleanup (deleted)

**Check:**
- [ ] Timeout hoạt động đúng (15 seconds)
- [ ] Error message rõ ràng
- [ ] Không có orphaned payment records

---

### 7. Payload Format Test

**Test với các format khác nhau:**

**Test 7.1: courseId (camelCase)**
```json
{
  "courseId": "test_course_id",
  "userId": "test_user_id"
}
```
**Expected:** ✅ Hoạt động (normalize thành course_id, user_id)

**Test 7.2: course_id (snake_case)**
```json
{
  "course_id": "test_course_id",
  "user_id": "test_user_id"
}
```
**Expected:** ✅ Hoạt động

**Test 7.3: Mixed**
```json
{
  "courseId": "test_course_id",
  "user_id": "test_user_id"
}
```
**Expected:** ✅ Hoạt động

**Check:**
- [ ] Tất cả formats được hỗ trợ
- [ ] Normalize hoạt động đúng

---

### 8. Error Handling Test

**Test các error scenarios:**

**Test 8.1: Database error**
- Simulate MongoDB connection error
**Expected:** 500 với message "Lỗi khi tạo payment record"

**Test 8.2: SePay API error**
- Simulate SePay API error
**Expected:** 500 với message "Lỗi khi tạo payment link"

**Test 8.3: Course not found**
- Use invalid course_id
**Expected:** 404 với message "Khóa học không tồn tại"

**Check:**
- [ ] Tất cả errors được handle
- [ ] Response luôn được trả về (không timeout)
- [ ] Error messages rõ ràng

---

### 9. Performance Test

**Test với multiple requests:**

```bash
# Send 10 concurrent requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/payments \
    -H "Content-Type: application/json" \
    -d '{"course_id":"test","user_id":"test"}' &
done
wait
```

**Expected:**
- ✅ Tất cả requests được xử lý
- ✅ Response time < 1 second mỗi request
- ✅ Không có timeout errors

**Check:**
- [ ] Tất cả requests thành công
- [ ] Performance ổn định
- [ ] Không có race conditions

---

### 10. Frontend Integration Test

**Full user flow:**

1. User login
2. Browse courses
3. Click on paid course (5000 VND)
4. Click "Đăng ký"
5. See payment page

**Expected:**
- ✅ No console errors
- ✅ Payment API call succeeds
- ✅ User redirected to payment URL
- ✅ Payment record created in DB

**Check:**
- [ ] Flow hoàn chỉnh không lỗi
- [ ] User experience mượt mà
- [ ] Error handling tốt (nếu có lỗi)

---

## 🐛 Debug Steps

### Nếu vẫn timeout:

1. **Check backend logs:**
   - Xem checkpoint nào bị treo
   - Check SePay service logs

2. **Test backend trực tiếp:**
   ```bash
   curl -X POST http://localhost:3004/payments \
     -H "Content-Type: application/json" \
     -d '{"course_id":"test","user_id":"test"}'
   ```

3. **Check SePay service:**
   - Verify SePay API call có timeout không
   - Check network connectivity

4. **Check database:**
   - Verify MongoDB connection
   - Check query performance

---

## ✅ Final Verification

Sau khi fix, verify:

- [ ] ✅ Postman test pass
- [ ] ✅ Browser test pass
- [ ] ✅ Backend logs đầy đủ
- [ ] ✅ Database records đúng
- [ ] ✅ Timeout test pass
- [ ] ✅ Error handling test pass
- [ ] ✅ Performance test pass
- [ ] ✅ Frontend integration test pass

**Nếu tất cả pass → Fix thành công! 🎉**

