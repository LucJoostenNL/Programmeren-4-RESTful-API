const express = require('express')
const router = express.Router()
const AuthController = require('../CONTROLLERS/authentication.controller')

// Authentication routes
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/login', AuthController.login)
router.get('/users', AuthController.getAll)
router.get('/users/:id', AuthController.getUserByID)

module.exports = router