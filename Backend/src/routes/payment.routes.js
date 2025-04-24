const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controller');

router.post('/create', paymentController.createPayment);
router.post('/update-status', paymentController.updatePaymentStatus);
router.get('/:orderId', paymentController.getPaymentById);

router.get('/generate_qr/:orderId', paymentController.generateQRCode);

module.exports = router;
