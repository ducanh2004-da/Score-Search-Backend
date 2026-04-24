# 🎓 Hệ Thống Tra Cứu Điểm Thi THPT Quốc Gia (Backend API)

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

Hệ thống cung cấp API hiệu suất cao phục vụ việc tra cứu điểm thi, phân tích phổ điểm và thống kê thứ hạng học sinh trong kỳ thi THPT Quốc Gia. Dự án được thiết kế với kiến trúc tối ưu, khả năng chịu tải tốt thông qua việc áp dụng bộ nhớ đệm (Caching) và truy vấn cơ sở dữ liệu chuyên sâu.

## ✨ Tính Năng Nổi Bật

- **🔍 Tra Cứu Nhanh Chóng:** Tìm kiếm điểm thi chi tiết của học sinh thông qua Số báo danh (SBD).
- **🏆 Bảng Xếp Hạng:** Thống kê Top 10 học sinh có tổng điểm khối A (Toán, Lý, Hóa) cao nhất toàn quốc.
- **📊 Phân Tích Phổ Điểm:** Thống kê chi tiết tỷ lệ học sinh đạt điểm giỏi, khá, trung bình, yếu cho các môn học lõi.
- **⚡ Tối Ưu Hiệu Năng:** - Tích hợp **Redis Cache-Aside** để giảm thiểu truy vấn DB lặp lại, đạt tốc độ phản hồi tính bằng mili-giây.
  - Xử lý mảng dữ liệu lớn (hàng triệu bản ghi) bằng **Raw SQL** trực tiếp trên PostgreSQL thay vì tính toán trên RAM của Node.js.

## 🛠 Công Nghệ Sử Dụng

- **Framework:** NestJS (Node.js)
- **API Interface:** GraphQL (Apollo Server)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching:** Redis (`cache-manager`, `cache-manager-redis-yet`)
- **Package Manager:** Yarn

## 🚀 Hướng Dẫn Cài Đặt Và Khởi Chạy

### 1. Yêu cầu hệ thống (Prerequisites)
- Node.js (Khuyến nghị phiên bản v20 LTS)
- Yarn (v1.22+)
- PostgreSQL Database
- Redis Server (Hoặc URL kết nối Redis trên Cloud)

### 2. Thêm các biến môi trường vào .env

### 3. Cài đặt và chạy dự án 
Clone dự án về máy, mở terminal tại thư mục gốc và chạy lệnh:
```bash
yarn install
```
Khởi tạo ORM trên máy:
```bash
npx prisma generate
```
Chạy dự án:
```bash
yarn start:dev
```
