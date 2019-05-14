const express = require('express')
const router = express.Router()
const reservationController = require('../CONTROLLERS/reservations.controller')
const validateToken = require('../CONTROLLERS/authentication.controller').validateToken;

// reservations from an apparment with id
router.post('/:id/reservations', validateToken, reservationController.createReservationByApartmentID);
router.get('/:id/reservations', validateToken, reservationController.getReservationByApartmentID);

// reservations with an id form an appartment with id
router.get('/:id/reservations/:resId', validateToken, reservationController.getReservationByID);
router.put('/:appId/reservations/:resId', validateToken, reservationController.updateReservationByID);
router.delete('/:appId/reservations/:resId', validateToken, reservationController.deleteReservationByID);

module.exports = router