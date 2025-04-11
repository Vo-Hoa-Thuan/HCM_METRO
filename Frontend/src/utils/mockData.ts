// Mock data to use when API calls fail (e.g., no internet connection)

export const mockTickets = [
  {
    id: 'ticket-single-01',
    type: 'single',
    name: 'Vé một lượt',
    price: 15000,
    description: 'Vé một lượt sử dụng cho một hành trình',
    validityPeriod: '24 giờ',
    restrictions: 'Chỉ sử dụng một lần trong ngày',
    isDiscounted: false,
    discountPercentage: 0,
    status: 'inactive'
  },
  {
    id: 'ticket-return-01',
    type: 'return',
    name: 'Vé khứ hồi',
    price: 28000,
    description: 'Vé khứ hồi sử dụng cho hai lượt đi và về',
    validityPeriod: '24 giờ',
    restrictions: 'Phải sử dụng trong cùng một ngày',
    isDiscounted: false,
    discountPercentage: 0,
    status: 'active'
  },
  {
    id: 'ticket-day-01',
    type: 'day',
    name: 'Vé ngày',
    price: 35000,
    description: 'Vé không giới hạn số lượt đi trong một ngày',
    validityPeriod: '24 giờ',
    restrictions: 'Chỉ sử dụng trong ngày phát hành',
    isDiscounted: false,
    discountPercentage: 0,
    status: 'active'
  },
  {
    id: 'ticket-week-01',
    type: 'week',
    name: 'Vé tuần',
    price: 120000,
    description: 'Vé không giới hạn số lượt đi trong một tuần',
    validityPeriod: '7 ngày',
    restrictions: 'Chỉ sử dụng trong tuần phát hành',
    isDiscounted: true,
    discountPercentage: 15,
    status: 'active'
  },
  {
    id: 'ticket-month-01',
    type: 'month',
    name: 'Vé tháng',
    price: 450000,
    description: 'Vé không giới hạn số lượt đi trong một tháng',
    validityPeriod: '30 ngày',
    restrictions: 'Chỉ sử dụng trong tháng phát hành',
    isDiscounted: true,
    discountPercentage: 25,
    status: 'active'
  }
];

export const mockStations = [
  {
    id: 'station-01',
    name: 'Bến Thành',
    nameVi: 'Bến Thành',
    coordinates: [106.6983, 10.7731],
    lines: ['line-01'],
    facilities: ['wifi', 'bathroom', 'ticket-machine', 'elevator'],
    isInterchange: true,
    address: '1 Công trường Quách Thị Trang, Phường Bến Thành, Quận 1, TP.HCM',
    status: 'operational',
    hasWifi: true,
    hasParking: true,
    hasTicketMachine: true,
    hasAccessibility: true,
    hasBathroom: true
  },
  {
    id: 'station-02',
    name: 'Opera House',
    nameVi: 'Nhà hát Thành phố',
    coordinates: [106.7033, 10.7765],
    lines: ['line-01'],
    facilities: ['wifi', 'bathroom', 'ticket-machine'],
    isInterchange: false,
    address: 'Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM',
    status: 'operational',
    hasWifi: true,
    hasParking: false,
    hasTicketMachine: true,
    hasAccessibility: true,
    hasBathroom: true
  }
];

export const mockLines = [
  {
    id: 'line-01',
    name: 'Tuyến Metro Số 1 (Bến Thành - Suối Tiên)',
    color: '#0066CC',
    stations: ['station-01', 'station-02'],
    operatingHours: {
      weekday: '5:00 - 23:00',
      weekend: '5:30 - 22:30'
    },
    frequency: {
      peakHours: '3-5 phút',
      offPeakHours: '7-10 phút'
    },
    status: 'operational',
    openingDate: '2023-12-31',
    length: 19.7
  }
];

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};
