const Order = require('../models/order.model');
const QRCode = require('qrcode');


const getExpiryDate = (ticketType) => {
  const now = new Date();
  switch (ticketType) {
    case 'ngay':
      return new Date(now.setDate(now.getDate() + 1));
    case 'tuan':
      return new Date(now.setDate(now.getDate() + 7));
    case 'thang':
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return now;
  }
};

exports.createPayment = async (req, res) => {
  try {
    const {
      orderId,
      userName,
      userPhone,
      ticketType,
      paymentMethod,
      totalPrice,
      paymentStatus,
      routes,
      groupSize
    } = req.body;

    const newOrder = new Order({
      orderId,
      userId: req.user.id,
      userName,
      userPhone,
      ticketType,
      paymentMethod,
      totalPrice,
      paymentStatus,
      routes,
      createdAt: new Date(),
    });

    // Gán thêm thuộc tính tùy theo loại vé
    if (['ngay', 'tuan', 'thang'].includes(ticketType)) {
      newOrder.expiryDate = getExpiryDate(ticketType);
    } else if (ticketType === 'luot') {
      newOrder.usageCount = 1;
    } else if (ticketType === 'khu hoi') {
      newOrder.usageCount = 2;
    } else if (ticketType === 'nhom') {
      newOrder.groupSize = groupSize;
      newOrder.usageCount = 1;
    }

    await newOrder.save();
    res.status(201).json({ success: true, message: 'Tạo đơn hàng thành công', data: newOrder });

  } catch (err) {
    console.error('Lỗi tạo đơn hàng:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo đơn hàng' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại!' });
    }

    if (order.paymentStatus === paymentStatus) {
      return res.status(400).json({ success: false, message: 'Trạng thái thanh toán đã được cập nhật!' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({ success: true, message: 'Cập nhật trạng thái thanh toán thành công!', data: order });
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái thanh toán:', err);
    res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi cập nhật trạng thái thanh toán.' });
  }
};

exports.getPaymentById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại!' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('Lỗi khi lấy thông tin thanh toán:', err);
    res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi lấy thông tin thanh toán.' });
  }
};

exports.generateQRCode = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
    }

    // Dữ liệu cho mã QR
    const qrData = {
      orderId: order.orderId,
      ticketType: order.ticketType,
      userName: order.userName,
      expiryDate: order.expiryDate,
    };

    // Tạo mã QR
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Lưu mã QR vào cơ sở dữ liệu
    order.qrCode = qrCode;
    await order.save();

    // Trả về mã QR đã tạo
    res.status(200).json({ success: true, qrCode });

  } catch (error) {
    console.error('Lỗi tạo mã QR:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo mã QR' });
  }
};

exports.getTicketHistory = async (req, res) => {
  try {
    const tickets = await Order.find({
      userId: req.user.id,
      paymentStatus: 'paid'
    }).sort({ createdAt: -1 });

    // Chuyển đổi dữ liệu để phù hợp với frontend
    const formattedTickets = tickets.map(ticket => ({
      id: ticket._id.toString(),
      orderId: ticket.orderId,
      purchaseDate: ticket.createdAt,
      ticketType: ticket.ticketType,
      price: ticket.totalPrice,
      status: new Date() > new Date(ticket.expiryDate) ? 'expired' : 'active',
      validFrom: ticket.createdAt,
      validTo: ticket.expiryDate || ticket.createdAt,
      qrCode: ticket.qrCode,
      routes: ticket.routes,
      usageCount: ticket.usageCount,
      groupSize: ticket.groupSize
    }));

    res.status(200).json(formattedTickets);
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử vé:', error);
    res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra khi lấy lịch sử vé' });
  }
};