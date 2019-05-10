const express = require('express')
const router = express.Router()

// appartements
router.get('/');
router.post('/');

// appartments with id
router.get('/:id');
router.put('/:id');
router.delete('/:id');

module.exports = router