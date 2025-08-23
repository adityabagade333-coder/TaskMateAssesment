const express = require('express');
const { register, login, getMe, updateProfile, changePassword, logout } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const { validateRegister, validateLogin, validateUpdateProfile, validateChangePassword } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', auth, getMe);
router.put('/profile', auth, validateUpdateProfile, updateProfile);
router.put('/change-password', auth, validateChangePassword, changePassword);
router.post('/logout', auth, logout);

module.exports = router;