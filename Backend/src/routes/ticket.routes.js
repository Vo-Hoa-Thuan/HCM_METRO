const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.get('/get', ticketController.getTickets);
router.get('/get/:id', ticketController.getTicketById);
router.get('/type/:type', ticketController.getTicketByType);
router.get('/types', ticketController.getTicketTypes);
router.post('/create', ticketController.createTicket);
router.put('/update/:id', ticketController.updateTicket);
router.delete('/delete/:id', ticketController.deleteTicket);

module.exports = router;
