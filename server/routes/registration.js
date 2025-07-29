import express from 'express';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendRegistrationEmail } from '../utils/sendEmail.js';

// Get all registrations for a student by studentId

const router = express.Router();








router.post('/', async (req, res) => {
  const { studentUsername, eventId } = req.body;

  try {
    console.log("Received registration for:", studentUsername, "Event:", eventId);

    const user = await User.findOne({ username: studentUsername });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'student') return res.status(403).json({ message: 'Only students can register' });

    const existing = await Registration.findOne({ studentId: user._id, eventId });
    if (existing) return res.status(400).json({ message: 'Already registered' });

    const registration = new Registration({ studentId: user._id, eventId });
    await registration.save();

    // Fetch event details
    const event = await Event.findById(eventId);
    if (event && user.email) {
      await sendRegistrationEmail(user.email, event.title); // ✅ send email
    }

    console.log("✅ Registration successful:", registration._id);
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registrations' });
  }
});


router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId || studentId === 'undefined') {
      return res.status(400).json({ error: 'Invalid studentId in request' });
    }

    const registrations = await Registration.find({ studentId });
    res.json(registrations);
  } catch (err) {
    console.error("Error fetching registrations for student:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Unregister route (DELETE)
router.delete('/', async (req, res) => {
  const { studentUsername, eventId } = req.body;

  try {
    const user = await User.findOne({ username: studentUsername });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const deleted = await Registration.findOneAndDelete({ studentId: user._id, eventId });
    if (!deleted) return res.status(400).json({ message: 'You are not registered for this event' });

    res.json({ message: 'Successfully unregistered' });
  } catch (err) {
    console.error("Unregistration failed:", err);
    res.status(500).json({ message: 'Unregistration failed', error: err.message });
  }
});


export default router;
