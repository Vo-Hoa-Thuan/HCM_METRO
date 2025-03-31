
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string; // ISO 8601 date string
  tickets: string[]; // Danh sách ID vé đã mua
  favoriteStations?: string[]; // Danh sách ID ga yêu thích
  preferredLanguage: "vi" | "en";
};

export type Station = {
  id: string;
  name: string;
  nameVi: string;
  coordinates: [number, number]; // [longitude, latitude]
  lines: string[];
  facilities: string[];
  isInterchange: boolean;
  isDepot?: boolean;
  isUnderground?: boolean;
};

export type MetroLine = {
  id: string;
  name: string;
  nameVi: string;
  color: string;
  stations: string[]; // station ids
  operatingHours: {
    weekday: string;
    weekend: string;
  };
  frequency: {
    peakHours: string;
    offPeakHours: string;
  };
};

export type RouteSegment = {
  from: string;
  to: string;
  line: string;
  duration: number; // in minutes
  distance: number; // in kilometers
};

export type Ticket = {
  id: string;
  type: string;
  name: string;
  price: number;
  description: string;
  validityPeriod?: string;
};


export const users: User[] = [
  {
    id: "u1",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0987654321",
    registeredAt: "2024-01-15T08:30:00Z",
    tickets: ["t1", "t3"],
    favoriteStations: ["s1", "s9"],
    preferredLanguage: "vi",
  },
  {
    id: "u2",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    registeredAt: "2024-02-10T12:45:00Z",
    tickets: ["t2", "t4", "t5"],
    favoriteStations: ["s13", "s19"],
    preferredLanguage: "en",
  },
  {
    id: "u3",
    name: "Lê Quốc C",
    email: "lequocc@example.com",
    phone: "0909123456",
    registeredAt: "2024-03-05T09:15:00Z",
    tickets: ["t1", "t6"],
    preferredLanguage: "vi",
  },
];
// Sample station data
export const stations: Station[] = [
  // Tuyến Đỏ (Line 1) - Ben Thanh - Suoi Tien
  {
    id: "s1",
    name: "Ben Thanh",
    nameVi: "Bến Thành",
    coordinates: [106.698471, 10.773237],
    lines: ["red", "blue", "purple"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: true,
    isUnderground: true
  },
  {
    id: "s2",
    name: "Opera House",
    nameVi: "Nhà hát thành phố",
    coordinates: [106.701685, 10.776830],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false,
    isUnderground: true
  },
  {
    id: "s3",
    name: "Ba Son",
    nameVi: "Ba Son",
    coordinates: [106.705928, 10.786654],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
    isUnderground: true
  },
  {
    id: "s4",
    name: "Van Thanh Park",
    nameVi: "Công viên Văn Thánh",
    coordinates: [106.714511, 10.801131],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s5",
    name: "Tan Cang",
    nameVi: "Tân Cảng",
    coordinates: [106.719940, 10.803595],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },
  {
    id: "s6",
    name: "Thao Dien",
    nameVi: "Thảo Điền",
    coordinates: [106.730584, 10.803864],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s7",
    name: "An Phu",
    nameVi: "An Phú",
    coordinates: [106.747449, 10.803864],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },
  {
    id: "s8",
    name: "Rach Chiec",
    nameVi: "Rạch Chiếc",
    coordinates: [106.766760, 10.803864],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s9",
    name: "Phuoc Long",
    nameVi: "Phước Long",
    coordinates: [106.770554, 10.814576],
    lines: ["red", "green"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: true
  },
  {
    id: "s10",
    name: "Binh Thai",
    nameVi: "Bình Thái",
    coordinates: [106.776647, 10.824858],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s11",
    name: "Thu Duc",
    nameVi: "Thủ Đức",
    coordinates: [106.781368, 10.832131],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },
  {
    id: "s12",
    name: "High-Tech Park",
    nameVi: "Khu Công Nghệ Cao",
    coordinates: [106.789179, 10.840453],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },
  {
    id: "s13",
    name: "Suoi Tien Park",
    nameVi: "Công viên Suối Tiên",
    coordinates: [106.796388, 10.847725],
    lines: ["red", "yellow"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: true
  },
  {
    id: "s14",
    name: "Suoi Tien Terminal",
    nameVi: "Bến xe Suối Tiên",
    coordinates: [106.802868, 10.853440],
    lines: ["red"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false,
    isDepot: true
  },

  // Tuyến Xanh (Line 2) - Thu Thiem - Cu Chi
  {
    id: "s15",
    name: "Thu Thiem",
    nameVi: "Thủ Thiêm",
    coordinates: [106.720541, 10.782318],
    lines: ["blue"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false
  },
  {
    id: "s16",
    name: "District 2 Bus Terminal",
    nameVi: "Bến xe Quận 2",
    coordinates: [106.712408, 10.808211],
    lines: ["blue"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },
  {
    id: "s17",
    name: "Thao Dien Interchange",
    nameVi: "Giao lộ Thảo Điền",
    coordinates: [106.734038, 10.816534],
    lines: ["blue", "brown"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: true
  },
  {
    id: "s18",
    name: "Pham Van Dong",
    nameVi: "Phạm Văn Đồng",
    coordinates: [106.749615, 10.833182],
    lines: ["blue"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },
  {
    id: "s19",
    name: "Go Vap Park",
    nameVi: "Công viên Gò Vấp",
    coordinates: [106.669777, 10.837952],
    lines: ["blue", "yellow"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: true
  },
  {
    id: "s20",
    name: "Tay Ninh Bus Terminal",
    nameVi: "Bến xe Tây Ninh",
    coordinates: [106.634887, 10.845782],
    lines: ["blue"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false,
    isDepot: true
  },

  // Tuyến Xanh lá (Line 3) - Ben Thanh - Binh Tan
  {
    id: "s21",
    name: "Cong Hoa",
    nameVi: "Cộng Hòa",
    coordinates: [106.648273, 10.794539],
    lines: ["green"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s22",
    name: "Hoa Hung",
    nameVi: "Hòa Hưng",
    coordinates: [106.667156, 10.782318],
    lines: ["green", "purple"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: true
  },
  {
    id: "s23",
    name: "Minh Phung",
    nameVi: "Minh Phụng",
    coordinates: [106.642952, 10.751741],
    lines: ["green"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s24",
    name: "Binh Tan",
    nameVi: "Bình Tân",
    coordinates: [106.607347, 10.733518],
    lines: ["green"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false,
    isDepot: true
  },

  // Tuyến Tím (Line 4) - Lang Cha Ca - Hiep Phuoc Port
  {
    id: "s25",
    name: "Lang Cha Ca",
    nameVi: "Lăng Cha Cả",
    coordinates: [106.659043, 10.796098],
    lines: ["purple"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false
  },
  {
    id: "s26",
    name: "Nguyen Van Linh",
    nameVi: "Nguyễn Văn Linh",
    coordinates: [106.697701, 10.741079],
    lines: ["purple"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false
  },
  {
    id: "s27",
    name: "Hiep Phuoc Port",
    nameVi: "Cảng Hiệp Phước",
    coordinates: [106.732117, 10.684347],
    lines: ["purple"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false,
    isDepot: true
  },

  // Tuyến Vàng (Line 5) - Can Giuoc Bus Terminal - Saigon Bridge
  {
    id: "s28",
    name: "Can Giuoc Bus Terminal",
    nameVi: "Bến xe Cần Giuộc",
    coordinates: [106.644211, 10.713736],
    lines: ["yellow"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false,
    isDepot: true
  },
  {
    id: "s29",
    name: "Saigon Bridge",
    nameVi: "Cầu Sài Gòn",
    coordinates: [106.724707, 10.789589],
    lines: ["yellow"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false
  },

  // Tuyến Nâu (Line 6) - Ba Queo - Phu Lam Roundabout
  {
    id: "s30",
    name: "Ba Queo",
    nameVi: "Ba Quẹo",
    coordinates: [106.637587, 10.760064],
    lines: ["brown"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false
  },
  {
    id: "s31",
    name: "Phu Lam Roundabout",
    nameVi: "Vòng xoay Phú Lâm",
    coordinates: [106.619906, 10.742633],
    lines: ["brown"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: false,
    isDepot: true
  }
];

// Sample metro line data
export const metroLines: MetroLine[] = [
  {
    id: "red",
    name: "Red Line (Line 1)",
    nameVi: "Tuyến Đỏ (Số 1)",
    color: "#E73C3E",
    stations: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "5 phút",
      offPeakHours: "10 phút",
    },
  },
  {
    id: "blue",
    name: "Blue Line (Line 2)",
    nameVi: "Tuyến Xanh (Số 2)",
    color: "#0067C0",
    stations: ["s1", "s15", "s16", "s17", "s18", "s19", "s20"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "6 phút",
      offPeakHours: "12 phút",
    },
  },
  {
    id: "green",
    name: "Green Line (Line 3)",
    nameVi: "Tuyến Xanh Lá (Số 3)",
    color: "#4CAF50",
    stations: ["s1", "s22", "s21", "s23", "s24"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "6 phút",
      offPeakHours: "12 phút",
    },
  },
  {
    id: "purple",
    name: "Purple Line (Line 4)",
    nameVi: "Tuyến Tím (Số 4)",
    color: "#9C27B0",
    stations: ["s1", "s22", "s25", "s26", "s27"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "7 phút",
      offPeakHours: "14 phút",
    },
  },
  {
    id: "yellow",
    name: "Yellow Line (Line 5)",
    nameVi: "Tuyến Vàng (Số 5)",
    color: "#FFC107",
    stations: ["s28", "s19", "s13"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "7 phút",
      offPeakHours: "14 phút",
    },
  },
  {
    id: "brown",
    name: "Brown Line (Line 6)",
    nameVi: "Tuyến Nâu (Số 6)",
    color: "#795548",
    stations: ["s30", "s17", "s31"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "8 phút",
      offPeakHours: "15 phút",
    },
  }
];

// Sample ticket data
export const tickets: Ticket[] = [
  {
    id: "t1",
    type: "single",
    name: "Single Journey",
    price: 15000,
    description: "Valid for one journey on any line",
  },
  {
    id: "t2",
    type: "return",
    name: "Return Journey",
    price: 25000,
    description: "Valid for a return journey on the same day",
  },
  {
    id: "t3",
    type: "day",
    name: "1-Day Pass",
    price: 50000,
    description: "Unlimited travel for one day",
    validityPeriod: "1 day",
  },
  {
    id: "t4",
    type: "week",
    name: "7-Day Pass",
    price: 200000,
    description: "Unlimited travel for seven consecutive days",
    validityPeriod: "7 days",
  },
  {
    id: "t5",
    type: "month",
    name: "30-Day Pass",
    price: 750000,
    description: "Unlimited travel for thirty consecutive days",
    validityPeriod: "30 days",
  },
];

// Helper function to get station by ID
export const getStationById = (id: string): Station | undefined => {
  return stations.find(station => station.id === id);
};

// Helper function to get line by ID
export const getLineById = (id: string): MetroLine | undefined => {
  return metroLines.find(line => line.id === id);
};

// Function to calculate distance between two coordinates (in kilometers)
export const calculateDistance = (
  coord1: [number, number],
  coord2: [number, number]
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Function to format price in VND
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(price);
};
