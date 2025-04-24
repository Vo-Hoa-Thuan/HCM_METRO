const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/vnpayController');

// router.get('/create_payment_url', vnpayController.getCreatePaymentPage);
router.post('/create_payment_url', vnpayController.createPayment);

router.get('/vnpay_return', vnpayController.vnpayReturn);
router.get('/vnpay_ipn', vnpayController.vnpayIpn);

// router.get('/querydr', vnpayController.getQueryPage);
// router.post('/querydr', vnpayController.queryTransaction);

// router.get('/refund', vnpayController.getRefundPage);
// router.post('/refund', vnpayController.refundTransaction);

module.exports = router;
