const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments.controller');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/history', authenticateToken, paymentController.getTicketHistory);
router.post('/create', authenticateToken, paymentController.createPayment);
router.post('/update-status', authenticateToken, paymentController.updatePaymentStatus);
router.get('/:orderId', authenticateToken, paymentController.getPaymentById);

router.get('/generate_qr/:orderId', authenticateToken, paymentController.generateQRCode);

module.exports = router;
