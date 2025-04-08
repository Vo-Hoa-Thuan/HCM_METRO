
export type MetroImage = {
  url: string;
  caption: string;
  description: string;
  location: string;
  date?: string;
  category?: string;
};

export const metroImages: MetroImage[] = [
  {
    url: "https://img.vietcetera.com/uploads/images/17-aug-2020/metro-hcm-bui-vien.jpg",
    caption: "Tuyến Metro số 1 tại Bến Thành - Suối Tiên",
    description: "Tuyến metro đầu tiên của TP.HCM, nối liền trung tâm thành phố với Khu Du lịch Văn hóa Suối Tiên.",
    location: "Ga Bến Thành, Quận 1",
    category: "infrastructure"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Ho_Chi_Minh_City_Metro_-_Construction_of_Ba_Son_station.jpg",
    caption: "Ga Ba Son trong quá trình xây dựng",
    description: "Ga Ba Son là một trong những ga trên tuyến metro số 1, nằm ở khu vực có nhiều di tích lịch sử.",
    location: "Ga Ba Son, Quận 1",
    category: "construction"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Line_1_Ho_Chi_Minh_City_Metro.jpg/1280px-Line_1_Ho_Chi_Minh_City_Metro.jpg",
    caption: "Tàu Metro chạy thử nghiệm",
    description: "Tàu điện Metro TP.HCM trong quá trình chạy thử nghiệm trên đường ray cao, với thiết kế hiện đại, thân thiện môi trường.",
    location: "Đoạn trên cao, Quận 2",
    category: "trains"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/HCMC_Metro_Line_1_train_set_at_Long_Binh_Depot.jpg/1280px-HCMC_Metro_Line_1_train_set_at_Long_Binh_Depot.jpg",
    caption: "Đoàn tàu Metro tại depot Long Bình",
    description: "Các đoàn tàu Metro được nhập khẩu từ Nhật Bản, được trang bị công nghệ hiện đại với nhiều tính năng an toàn.",
    location: "Depot Long Bình, TP. Thủ Đức",
    category: "trains"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Ho_Chi_Minh_City_Metro_Binh_Thai_station_under_construction.jpg/1280px-Ho_Chi_Minh_City_Metro_Binh_Thai_station_under_construction.jpg",
    caption: "Ga Bình Thái đang xây dựng",
    description: "Ga Bình Thái là một trong những ga trên tuyến Metro số 1, phục vụ khu vực đông dân cư của TP.HCM.",
    location: "Ga Bình Thái, TP. Thủ Đức",
    category: "construction"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Ben_Thanh_terminal_in_Ho_Chi_Minh_City.jpg/1280px-Ben_Thanh_terminal_in_Ho_Chi_Minh_City.jpg",
    caption: "Ga trung tâm Bến Thành",
    description: "Ga Bến Thành là ga trung tâm của hệ thống Metro TP.HCM, nơi kết nối nhiều tuyến Metro trong tương lai.",
    location: "Ga Bến Thành, Quận 1",
    category: "stations"
  },
  {
    url: "https://img.vietcetera.com/uploads/images/17-aug-2020/metro-hcm-progress.jpg",
    caption: "Tiến độ xây dựng Metro TP.HCM",
    description: "Hình ảnh toàn cảnh của dự án Metro TP.HCM, thể hiện tiến độ xây dựng các đoạn trên cao và hầm ngầm.",
    location: "Quận 2, TP.HCM",
    category: "construction"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/HCMC_Metro_Suoi_Tien_Terminal.jpg/1280px-HCMC_Metro_Suoi_Tien_Terminal.jpg",
    caption: "Nhà ga Suối Tiên",
    description: "Nhà ga Suối Tiên là một trong những ga lớn của tuyến Metro số 1, kết nối với Khu Du lịch Văn hóa Suối Tiên và Bến xe Miền Đông mới.",
    location: "Ga Suối Tiên, TP. Thủ Đức",
    category: "stations"
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/HCMC_Metro_Thao_Dien_Station.jpg/1280px-HCMC_Metro_Thao_Dien_Station.jpg",
    caption: "Nhà ga Thảo Điền",
    description: "Nhà ga Thảo Điền phục vụ khu vực có nhiều cư dân nước ngoài sinh sống, mang kiến trúc hiện đại, thông thoáng.",
    location: "Ga Thảo Điền, TP. Thủ Đức",
    category: "stations"
  }
];

// Các danh mục hình ảnh
export const imageCategories = [
  { id: "all", name: "Tất cả" },
  { id: "stations", name: "Nhà ga" },
  { id: "trains", name: "Đoàn tàu" },
  { id: "construction", name: "Xây dựng" },
  { id: "infrastructure", name: "Cơ sở hạ tầng" }
];
