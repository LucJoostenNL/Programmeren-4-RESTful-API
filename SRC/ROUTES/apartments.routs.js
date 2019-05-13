const express = require('express')
const router = express.Router()
const ApartmentController = require('../CONTROLLERS/apartments.controller')
const validateToken = require('../CONTROLLERS/authentication.controller').validateToken;


// appartements
router.get('/', validateToken, ApartmentController.getAppartments);
router.post('/', validateToken, ApartmentController.createAppartment);

// appartments with id
router.get('/:id', validateToken, ApartmentController.getApartmentByID);
router.put('/:id', validateToken, ApartmentController.updateApartmentByID);
router.delete('/:id', validateToken, ApartmentController.deleteApartmentByID);

module.exports = router