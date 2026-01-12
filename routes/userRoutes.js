const express = require('express');
const User = require('../models/user')
const router = express.Router();
const userController = require('../controllers/userController');
const authService = require('../services/authService')
const { getUser } = require('../services/authService');

router.post('/signUp',userController.signUp)
router.post('/login',userController.login)

router.get('/profile',getUser,userController.profile)
router.patch('/profile/password',getUser,userController.passwordUpdate)

module.exports = router;