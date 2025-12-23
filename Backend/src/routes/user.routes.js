const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');



router.post('/register', (req, res, next) => {
    console.log("👉 Route /register hit!");
    userController.registerUser(req, res, next);
});
router.post('/', authenticateToken, authorizeRoles('admin'), userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);
router.get('/new-users/stats', userController.getNewUsersByTime);
router.put('/:id/change-password', userController.changePassword);

module.exports = router;
