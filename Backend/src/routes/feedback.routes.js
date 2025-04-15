const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');


router.get('/stats',  feedbackController.getFeedbackStats);
router.get('/', feedbackController.getAllFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.post('/', feedbackController.submitFeedback);
router.put('/:id', feedbackController.updateFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;