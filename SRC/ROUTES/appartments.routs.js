const express = require('express')
const router = express.Router()
const ApartmentController = require('../CONTROLLERS/appartments.controller')

// appartements
router.get('/', ApartmentController.getAppartments);
router.post('/', ApartmentController.test);

// appartments with id
router.get('/:id');
router.put('/:id');
router.delete('/:id');

module.exports = router