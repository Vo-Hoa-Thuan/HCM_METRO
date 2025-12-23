const moment = require('moment');
const crypto = require('crypto');
const axios = require('axios');
const qs = require('qs');
const config = require('../config/vnpay.json');
const { console } = require('inspector');
const { vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl } = config;
const Order = require('../models/order.model');


// Helper: Sắp xếp và encode tham số
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

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

// ========== CONTROLLER ==========

exports.createPayment = (req, res) => {
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = req.body.orderId;
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: req.body.language || 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toán vé METRO :${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: req.body.amount * 100,
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (req.body.bankCode) vnp_Params['vnp_BankCode'] = req.body.bankCode;

  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  sortedParams['vnp_SecureHash'] = signed;

  const paymentUrl = vnp_Url + '?' + qs.stringify(sortedParams, { encode: false });

  return res.json({
    message: 'Tạo URL thanh toán thành công',
    paymentUrl,
  });
};

exports.vnpayReturn = (req, res) => {
  const params = { ...req.query };
  const secureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
  const orderId = params['vnp_TxnRef'];

  const isValid = secureHash === signed;

  const baseRedirectUrl = "http://localhost:5713";


  if (isValid) {
    const code = params['vnp_ResponseCode'];
    const redirectUrl = code === '00'
      ? `${baseRedirectUrl}/payment/success?code=${code}&orderId=${orderId}`
      : `${baseRedirectUrl}/payment/fail?code=${code}&orderId=${orderId}`;

    console.log('VNPay return query:', req.query);
    return res.redirect(redirectUrl);

  } else {
    return res.redirect(`${baseRedirectUrl}/payment/fail?code=97`);
  }
};

exports.vnpayIpn = async (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];
  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const secretKey = vnp_HashSecret;
  const querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  if (secureHash === signed) {
    const order = await Order.findOne({ orderId });

    if (order) {
      let checkAmount = parseInt(order.totalAmount * 100) === parseInt(vnp_Params['vnp_Amount']);
      if (!checkAmount) {
        return res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
      }

      let paymentStatus = order.paymentStatus;
      if (paymentStatus === 'pending') {
        if (rspCode === '00') {
          order.paymentStatus = 'paid';
          await order.save();

          // Thêm vé vào lịch sử khi thanh toán thành công
          try {
            const validFrom = new Date();
            const validTo = getExpiryDate(order.ticketType);

            const ticketHistory = new TicketHistory({
              userId: order.userId, // Lấy userId từ order
              ticketType: order.ticketType,
              price: order.totalPrice,
              validFrom: validFrom,
              validTo: validTo
            });

            await ticketHistory.save();
            console.log('Đã thêm vé vào lịch sử:', ticketHistory);
          } catch (error) {
            console.error('Lỗi khi thêm vé vào lịch sử:', error);
          }

          res.status(200).json({ RspCode: '00', Message: 'Success' });
        } else {
          order.paymentStatus = 'failed';
          await order.save();
          res.status(200).json({ RspCode: '00', Message: 'Success' });
        }
      } else {
        res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
      }
    } else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found' });
    }
  } else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
  }
};