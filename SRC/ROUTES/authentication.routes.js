const express = require('express')
const router = express.Router()
const validateToken = require('../CONTROLLERS/authentication.controller')

// Authentication routes
router.post('/register', validateToken.register)
router.post('/login', validateToken.login)
router.get('/login', validateToken.login)
router.get('/users', validateToken.getAll)
router.get('/users/:id', validateToken.getUserByID)

module.exports = router