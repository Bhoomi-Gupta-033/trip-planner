const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");
const { regenerateDayAI } = require("../services/aiService");

const { generateItinerary } = require("../services/aiService");

/* ================================
   ✅ CREATE TRIP
================================ */
router.post("/create", auth, async (req, res) => {
  try {
    const { destination, days, budget, interests, language } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({ msg: "Missing fields ❌" });
    }

    const aiData = await generateItinerary({
      destination,
      days,
      budget,
      interests,
      language,
    });

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      days,
      budget,
      interests: interests || [],
      language,
      itinerary: aiData,
      savedBy: [],
    });

    return res.status(200).json({
      success: true,
      itinerary: trip.itinerary,
      trip,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ msg: "Server Error ❌" });
  }
});

/* ================================
   ⭐ GET SAVED TRIPS (FIXED POSITION)
================================ */
router.get("/saved", auth, async (req, res) => {
  try {
    const trips = await Trip.find({
      savedBy: req.user.id,
    });

    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error ❌" });
  }
});

/* ================================
   🔐 GET ALL TRIPS
================================ */
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching trips ❌" });
  }
});

/* ================================
   🔥 GET SINGLE TRIP
================================ */
router.get("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found ❌" });
    }

    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized ❌" });
    }

    res.json(trip);
  } catch (err) {
    res.status(500).json({ msg: "Error ❌" });
  }
});

/* ================================
   💾 UPDATE TRIP
================================ */
router.put("/:id", auth, async (req, res) => {
  try {
    const { itinerary } = req.body;

    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ msg: "Not found ❌" });

    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized ❌" });
    }

    trip.itinerary = itinerary;
    await trip.save();

    res.json({ msg: "Trip updated ✅", trip });
  } catch {
    res.status(500).json({ msg: "Update failed ❌" });
  }
});

/* ================================
   ⭐ SAVE / UNSAVE TRIP
================================ */
router.post("/save/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ msg: "Trip not found ❌" });

    if (!trip.savedBy) trip.savedBy = [];

    const alreadySaved = trip.savedBy.some(
      (id) => id.toString() === req.user.id,
    );

    if (alreadySaved) {
      trip.savedBy = trip.savedBy.filter((id) => id.toString() !== req.user.id);
      await trip.save();
      return res.json({ msg: "Removed from saved ❌" });
    }

    trip.savedBy.push(req.user.id);
    await trip.save();

    res.json({ msg: "Saved successfully ⭐" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error ❌" });
  }
});

/* ================================
   🔄 REGENERATE DAY
================================ */
router.post("/regenerate/:id", async (req, res) => {
  try {
    const { day } = req.body;

    const trip = await Trip.findById(req.params.id);

    const existingActivities = trip.itinerary.days[day - 1].activities;

    const newDay = await regenerateDayAI({
      destination: trip.destination,
      dayNumber: day,
      interests: trip.interests,
      budget: trip.budget,
      existingActivities, // 🔥 IMPORTANT
    });

    trip.itinerary.days[day - 1] = newDay;

    await trip.save();

    res.json(newDay);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Regenerate failed" });
  }
});

/* ================================
   ❌ DELETE TRIP
================================ */
router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ msg: "Not found ❌" });

    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized ❌" });
    }

    await trip.deleteOne();

    res.json({ msg: "Deleted ✅" });
  } catch {
    res.status(500).json({ msg: "Error ❌" });
  }
});

module.exports = router;
