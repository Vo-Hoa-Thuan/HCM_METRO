# 🚇 HCM_METRO - Hệ Thống Thông Tin Metro TP.HCM

**HCM_METRO** là một nền tảng web giúp người dân và du khách dễ dàng tra cứu thông tin về hệ thống metro tại Thành phố Hồ Chí Minh. Dự án mô phỏng hoạt động các tuyến metro theo thời gian thực, cung cấp lộ trình tối ưu, hỗ trợ thanh toán vé điện tử và nhiều tính năng hữu ích khác.

## 🌟 Tính Năng Chính

- **Hiển thị bản đồ hệ thống metro trực quan**: Cung cấp thông tin về các tuyến metro, các ga và kết nối giữa các tuyến.
- **Tra cứu tuyến tàu và thời gian đến thực tế**: Giúp người dùng tra cứu thời gian tàu đến ga gần nhất.
- **Gợi ý lộ trình tối ưu dựa trên vị trí người dùng**: Dựa trên dữ liệu thời gian thực để gợi ý lộ trình di chuyển nhanh nhất.
- **Quản lý tài khoản và vé điện tử**: Tạo tài khoản và quản lý vé điện tử cho người dùng.
- **Thanh toán online**: Hỗ trợ thanh toán qua Momo, ZaloPay, Apple Pay, QR Code,...
- **Theo dõi tiến độ xây dựng và trạng thái hoạt động của các tuyến**: Cập nhật tình trạng và tiến độ thi công của các tuyến metro.
- **Hỗ trợ mã giảm giá, vé tháng, vé nhóm**: Cung cấp các ưu đãi cho người sử dụng.
- **Đánh giá và phản hồi dịch vụ**: Cho phép người dùng đánh giá chất lượng dịch vụ và gửi phản hồi.

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Next.js, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express
- **Cơ sở dữ liệu**: MongoDB
- **Xác thực**: Google OAuth, OTP qua số điện thoại
- **Triển khai**: Vercel, Railway, Render

## 🚀 Hướng Dẫn Cài Đặt

1. **Clone dự án về máy**:
    ```bash
    git clone <YOUR_GIT_URL>
    ```

2. **Di chuyển vào thư mục dự án**:
    ```bash
    cd <YOUR_PROJECT_NAME>
    ```

3. **Cài đặt các dependencies cần thiết**:
    ```bash
    npm install
    ```

4. **Tạo file `.env` trong thư mục Backend và thêm các biến sau**:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    LOCALHOST=http://localhost:5713
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    REFRESH_SECRET=your_refresh_secret
    SESSION_SECRET=your_sesion_secret
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN==your_twilio_auth_token
    TWILIO_PHONE_NUMBER==your_twilio_phone_number
    ```

5. **Khởi động server ở chế độ phát triển (có reload và preview)**:
    ```bash
    npm run dev
    ```

### 📂 Cấu Trúc Thư Mục

```plaintext
📂 HCM_METRO
│
│── 📂 backend                    # Backend với Node.js + Express + MongoDB
│   │── 📂 controllers            # Xử lý logic các API endpoint
│   │── 📂 models                 # Định nghĩa schema và model cho MongoDB
│   │── 📂 routes                  # Định nghĩa các route API và ánh xạ controller
│   │── 📂 config                  # Cấu hình ứng dụng (kết nối DB, JWT, API key...)
│   │── 📂 middleware             # Middleware xử lý xác thực, ghi log, phân quyền...
│   │── 📂 utils                   # Các hàm tiện ích dùng chung cho backend
│   │── server.js                  # Điểm khởi chạy backend (Express server)
│   └── package.json              # Cấu hình gói Node.js và các dependency
│
│── 📂 frontend                   # Frontend với React.js  
│   │── 📂 src                     
│   │   │── 📂 components         # Các thành phần giao diện UI (Button, Navbar,..)
│   │   │── 📂 pages              # Các trang chính (Home, Tìm tuyến, Mua vé,...)
│   │   │── 📂 api                # Định nghĩa các hàm gọi API backend
│   │   │── 📂 hooks              # Các custom hooks dùng chung (useAuth,...)
│   │   │── 📂 contexts           # React Context quản lý trạng thái toàn cục 
│   │   │── 📂 lib                 # Thư viện cấu hình (axios instance, format date,...)
│   │   │── 📂 utils               # Các hàm tiện ích phía frontend 
│   │   │── App.js                 # Thành phần gốc của ứng dụng React
│   │   │── index.js               # Điểm vào chính của ứng dụng React
│   └── package.json              # Cấu hình gói React và dependency
│
│── 📂 database                   # Dữ liệu mẫu (JSON) hoặc các bản backup MongoDB
│── 📂 docs                       # Tài liệu kỹ thuật, sơ đồ hệ thống, mô tả API...
│── 📂 public                     # Tệp tĩnh phục vụ frontend (favicon, logo...)
│── .gitignore                    # Bỏ qua file không cần thiết khi commit
│── README.md                     # Tài liệu hướng dẫn cài đặt và sử dụng dự án
│── .env                           # Chứa biến môi trường

```


## 💡 Định Hướng Phát Triển

- **Tích hợp bản đồ tương tác**: Cung cấp bản đồ sống động với dữ liệu thời gian thực từ cảm biến.
- **Thông báo chậm trễ hoặc sự cố tuyến**: Cập nhật và thông báo về sự cố hoặc chậm trễ của các chuyến tàu.
- **Thanh toán thẻ nội địa (VietQR)**: Tích hợp hệ thống thanh toán nội địa như VietQR.
- **Cập nhật tiến độ xây dựng tự động**: Tự động lấy thông tin tiến độ từ báo chí hoặc các cơ quan chính thống.

## 🤝 Đóng Góp

Hệ thống luôn hoan nghênh các đóng góp từ cộng đồng!  
Bạn có thể:

- Gửi **issue** nếu phát hiện lỗi.
- Tạo **pull request** nếu muốn nâng cấp/chỉnh sửa tính năng.
- Góp ý về UI/UX, bảo mật, hiệu năng, nội dung,...

---

> 📬 Liên hệ: [vohoathuan.devt@gmail.com]
> © 2025 – HCM_METRO Project Team.
