const User = require('../models/User');

// Get logged-in user profile
exports.getProfile = async (req, res) => {
    res.json(req.user);
};

// Update logged-in user profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({ message: 'Profile updated', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
