const express = require('express')
const router = express.Router()
const ApartmentController = require('../CONTROLLERS/appartments.controller')

// appartements
router.get('/', ApartmentController.getAppartments);
router.post('/', ApartmentController.createAppartment);

// appartments with id
router.get('/:id', ApartmentController.getApartmentByID);
router.put('/:id', ApartmentController.updateApartmentByID);
router.delete('/:id', ApartmentController.deleteApartmentByID);

module.exports = router