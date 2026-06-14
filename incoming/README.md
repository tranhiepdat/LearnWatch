# 📥 incoming — thả ảnh thô vào đây

Bạn cứ upload **tất cả ảnh đồng hồ** vào thư mục này, **đặt tên gì cũng được**
(kể cả `IMG_1234.jpg`, `z5.jpg`, `rolex (1).jpg`...). Không cần biết tên đồng hồ.

Sau khi bạn upload xong, Claude sẽ:
1. Mở từng ảnh để **nhận diện mẫu** (Pepsi, Hulk, Datejust...).
2. **Đổi tên đúng chuẩn** và chuyển sang `public/watches/`.
3. **Bổ sung/đối chiếu thông tin** (reference, biệt danh, chất liệu) trong dữ liệu app.
4. **Dọn sạch** thư mục `incoming/` này và push để Vercel cập nhật.

## Cách upload nhanh nhất (trên web GitHub)
1. Vào repo trên GitHub → bấm vào thư mục **`incoming`**.
2. Bấm **Add file → Upload files**.
3. **Kéo-thả cả 60 ảnh** vào (làm vài đợt nếu GitHub giới hạn số lượng/đợt).
4. Bấm **Commit changes** (commit thẳng vào `main` là được).
5. Nhắn Claude: "đã upload xong" — Claude sẽ xử lý phần còn lại.
