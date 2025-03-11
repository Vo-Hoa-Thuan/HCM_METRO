
export type Station = {
  id: string;
  name: string;
  nameVi: string;
  coordinates: [number, number]; // [longitude, latitude]
  lines: string[];
  facilities: string[];
  isInterchange: boolean;
};

export type MetroLine = {
  id: string;
  name: string;
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

// Sample station data
export const stations: Station[] = [
  {
    id: "s1",
    name: "Ben Thanh",
    nameVi: "Bến Thành",
    coordinates: [106.698471, 10.773237],
    lines: ["red", "blue"],
    facilities: ["elevator", "ticket-office", "restroom"],
    isInterchange: true,
  },
  {
    id: "s2",
    name: "Opera House",
    nameVi: "Nhà hát thành phố",
    coordinates: [106.701685, 10.776830],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false,
  },
  {
    id: "s3",
    name: "Ba Son",
    nameVi: "Ba Son",
    coordinates: [106.705928, 10.786654],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
  },
  {
    id: "s4",
    name: "Van Thanh Park",
    nameVi: "Công viên Văn Thánh",
    coordinates: [106.714511, 10.801131],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false,
  },
  {
    id: "s5",
    name: "Tan Cang",
    nameVi: "Tân Cảng",
    coordinates: [106.719940, 10.803595],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
  },
  {
    id: "s6",
    name: "Thao Dien",
    nameVi: "Thảo Điền",
    coordinates: [106.730584, 10.803864],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false,
  },
  {
    id: "s7",
    name: "An Phu",
    nameVi: "An Phú",
    coordinates: [106.747449, 10.803864],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
  },
  {
    id: "s8",
    name: "Rach Chiec",
    nameVi: "Rạch Chiếc",
    coordinates: [106.766760, 10.803864],
    lines: ["red"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false,
  },
  {
    id: "s9",
    name: "Pham Van Dong",
    nameVi: "Phạm Văn Đồng",
    coordinates: [106.749615, 10.833182],
    lines: ["blue"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
  },
  {
    id: "s10",
    name: "Binh Thai",
    nameVi: "Bình Thái",
    coordinates: [106.734038, 10.824858],
    lines: ["blue"],
    facilities: ["elevator", "ticket-machine"],
    isInterchange: false,
  },
  {
    id: "s11",
    name: "Thu Duc",
    nameVi: "Thủ Đức",
    coordinates: [106.721421, 10.816534],
    lines: ["blue"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
  },
  {
    id: "s12",
    name: "District 2 Bus Terminal",
    nameVi: "Bến xe Quận 2",
    coordinates: [106.712408, 10.808211],
    lines: ["blue"],
    facilities: ["elevator", "ticket-machine", "restroom"],
    isInterchange: false,
  },
];

// Sample metro line data
export const metroLines: MetroLine[] = [
  {
    id: "red",
    name: "Red Line",
    color: "#E73C3E",
    stations: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "5 minutes",
      offPeakHours: "10 minutes",
    },
  },
  {
    id: "blue",
    name: "Blue Line",
    color: "#0067C0",
    stations: ["s1", "s12", "s11", "s10", "s9"],
    operatingHours: {
      weekday: "5:30 - 22:30",
      weekend: "6:00 - 22:00",
    },
    frequency: {
      peakHours: "6 minutes",
      offPeakHours: "12 minutes",
    },
  },
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
