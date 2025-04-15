const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

router.get('/feedback', protect, restrictTo('admin', 'staff'), feedbackController.getAllFeedback);
router.get('/feedback/:id', protect, restrictTo('admin', 'staff'), feedbackController.getFeedbackById);
router.post('/feedback', feedbackController.submitFeedback);
router.put('/feedback/:id', protect, restrictTo('admin', 'staff'), feedbackController.updateFeedback);
router.delete('/feedback/:id', protect, restrictTo('admin'), feedbackController.deleteFeedback);
router.get('/feedback/stats', protect, restrictTo('admin', 'staff'), feedbackController.getFeedbackStats);

module.exports = router;