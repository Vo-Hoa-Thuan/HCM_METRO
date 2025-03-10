# HCM_METRO
📂 metro-project
│── 📂 backend        # Backend với Node.js + Express + MongoDB
│   │── 📂 src
│   │   │── 📂 config       # Cấu hình DB, API keys, biến môi trường
│   │   │── 📂 controllers  # Xử lý logic của API
│   │   │── 📂 models       # Định nghĩa schema MongoDB
│   │   │── 📂 routes       # Các endpoint API
│   │   │── 📂 middleware   # Middleware xử lý auth, logs...
│   │   │── 📂 services     # Xử lý logic phức tạp (gợi ý lộ trình, vé)
│   │   │── 📂 utils        # Hàm tiện ích dùng chung
│   │   │── index.js        # File chính khởi chạy server
│   │── .env               # Biến môi trường
│   │── package.json       # Cấu hình Backend
│   └── README.md          # Hướng dẫn Backend
│
│── 📂 frontend       # Frontend với React.js
│   │── 📂 public         # Static files (favicon, manifest.json)
│   │── 📂 src        
│   │   │── 📂 components  # Component UI (Button, Navbar, Map...)
│   │   │── 📂 pages       # Các trang chính (Home, Search, Ticket...)
│   │   │── 📂 hooks       # Custom hooks (nếu có)
│   │   │── 📂 services    # Gọi API (fetch dữ liệu từ Backend)
│   │   │── 📂 utils       # Hàm tiện ích
│   │   │── 📂 assets      # Hình ảnh, icon...
│   │   │── App.js        # Component gốc
│   │   │── index.js      # Điểm vào của React
│   │── .env              # Biến môi trường Frontend
│   │── package.json      # Cấu hình Frontend
│   └── README.md         # Hướng dẫn Frontend
│
│── 📂 database       # Dữ liệu mẫu hoặc file backup DB
│── 📂 docs           # Tài liệu dự án (API Docs, Diagram...)
│── .gitignore        # Bỏ qua file không cần thiết khi commit
│── README.md         # Hướng dẫn tổng quan dự án
