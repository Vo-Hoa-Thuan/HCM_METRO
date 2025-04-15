const express = require('express');
const router = express.Router();
const newsController = require('../controllers/new.controller');

router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);
router.post('/news', protect, restrictTo('admin', 'staff'), newsController.createNews);
router.put('/news/:id', protect, restrictTo('admin', 'staff'), newsController.updateNews);
router.delete('/news/:id', protect, restrictTo('admin'), newsController.deleteNews);

module.exports = router;