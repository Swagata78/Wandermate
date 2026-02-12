// utils/matchAlgorithm.js
const User = require("../models/User");

// Calculate compatibility score between two users
const calculateMatchScore = (user, otherUser) => {
  let score = 0;

  // ✅ Interests match (check existence first to avoid errors)
  if (Array.isArray(user.interests) && Array.isArray(otherUser.interests)) {
    const commonInterests = user.interests.filter((i) =>
      otherUser.interests.includes(i)
    );
    score += commonInterests.length * 5;
  }

  // ✅ Budget similarity (ensure both budgets are numbers)
  if (typeof user.budget === "number" && typeof otherUser.budget === "number") {
    const budgetDiff = Math.abs(user.budget - otherUser.budget);
    if (budgetDiff < 100) score += 5;
    else if (budgetDiff < 500) score += 3;
  }

  // ✅ Travel date overlap (ensure dates exist & are valid)
  if (
    user.travelDates?.start &&
    user.travelDates?.end &&
    otherUser.travelDates?.start &&
    otherUser.travelDates?.end
  ) {
    const userStart = new Date(user.travelDates.start);
    const userEnd = new Date(user.travelDates.end);
    const otherStart = new Date(otherUser.travelDates.start);
    const otherEnd = new Date(otherUser.travelDates.end);

    if (userEnd >= otherStart && userStart <= otherEnd) {
      score += 5;
    }
  }

  return score;
};

// Find best matches for a given user
const findMatches = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const others = await User.find({ _id: { $ne: userId } });

    const matches = others.map((u) => ({
      user: u,
      score: calculateMatchScore(user, u),
    }));

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);
    return matches;
  } catch (err) {
    console.error("Match algorithm error:", err.message);
    return [];
  }
};

module.exports = { calculateMatchScore, findMatches };
