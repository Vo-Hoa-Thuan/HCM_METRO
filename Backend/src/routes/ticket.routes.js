const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.get('/get', ticketController.getTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/create', ticketController.createTicket);
router.put('/:id/update', ticketController.updateTicket);
router.delete('/:id/deletedelete', ticketController.deleteTicket);

module.exports = router;
