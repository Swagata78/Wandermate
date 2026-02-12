const express = require('express');
const router = express.Router();
const { createTrip, getTrips, getMatches } = require('../controllers/tripController');
const authMiddleware = require('../utils/authMiddleware');
// Create a new trip
router.post('/', createTrip);
router.post('/', authMiddleware, createTrip)
// Get all trips
router.get('/', getTrips);

// Get matches for a user
router.get('/matches/:userId', getMatches);
router.get('/matches/:userId', authMiddleware, getMatches);
module.exports = router;
