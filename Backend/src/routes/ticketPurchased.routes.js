const express = require('express'); 
const router = express.Router();
const ticketPurchasedController = require('../controllers/ticketPurchased.controller');

router.get('/get', ticketPurchasedController.getTicketsPurchased); 


module.exports = router;
