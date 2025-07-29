// server/routes/events.js
import express from 'express';
import Event from '../models/Event.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

// server/routes/events.js
import mongoose from 'mongoose'; // ⬅️ Ensure this is imported
import Registration from '../models/Registration.js'; // ⬅️ Ensure this is imported




const upload = multer({ storage });
const router = express.Router();

// ✅ Create Event (with image upload)
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, time, location, createdBy } = req.body;

    const imageUrl = req.file?.path || null;

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      createdBy,
      imageUrl,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    console.error('❌ Error creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// 🔍 Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// 🔍 Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event' });
  }
});

router.get('/:id/count', async (req, res) => {
  try {
    const eventObjectId = new mongoose.Types.ObjectId(req.params.id); // ⬅️ FIX HERE
    const count = await Registration.countDocuments({ eventId: eventObjectId });

    res.json({ count });
  } catch (err) {
    console.error('Error in /:id/count:', err);
    res.status(500).json({ error: 'Failed to get participant count' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
