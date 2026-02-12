const Trip = require('../models/Trip');
const User = require('../models/User');
const { findMatches } = require('../utils/matchAlgorithm');

// Create a new trip
exports.createTrip = async (req, res) => {
    try {
        const { user, destination, startDate, endDate, budget } = req.body;
        const trip = new Trip({ user, destination, startDate, endDate, budget });
        await trip.save();
        res.status(201).json({ message: 'Trip created', trip });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all trips
exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().populate('user', 'name email interests');
        res.json(trips);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get travel buddy matches
exports.getMatches = async (req, res) => {
    try {
        const userId = req.params.userId;
        const matches = await findMatches(userId);
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
