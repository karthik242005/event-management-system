import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Student from '../models/Student.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const {
    username, email, password, role = 'student',
    name, year, branch, section, regNo, phone
  } = req.body;

  console.log('📥 Incoming registration:', { username, email, phone, regNo, role });

  try {
    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      console.log('⚠️ Username already taken');
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      console.log('⚠️ Email already taken');
      return res.status(409).json({ error: 'Email already taken' });
    }

    // Check if phone or regNo is already taken for students
    if (role === 'student') {
      const phoneExists = await Student.findOne({ phone });
      if (phoneExists) {
        console.log('⚠️ Phone number already taken');
        return res.status(409).json({ error: 'Phone number already taken' });
      }

      const regNoExists = await Student.findOne({ regNo });
      if (regNoExists) {
        console.log('⚠️ Registration number already taken');
        return res.status(409).json({ error: 'Registration number already taken' });
      }
    }

    // Hash password and save user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    console.log('✅ User saved');

    // Save student details if applicable
    if (role === 'student') {
      const student = new Student({
        userId: user._id,
        name,
        year,
        branch,
        section,
        regNo,
        phone,
        email,
        role
      });
      await student.save();
      console.log('✅ Student saved');
    }

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

  req.session.user = {
    _id: user._id, 
    username: user.username,
    role: user.role
  };

  res.status(200).json({
    message: 'Login successful',
    role: user.role
  });
});

// ✅ FIXED: Move outside
// GET /api/auth/session
router.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    return res.json(req.session.user); // ✅ user will now include _id
  } else {
    return res.status(401).json({ message: 'No active session' });
  }
});


// GET /api/auth/role/:username
router.get('/role/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

export default router;
