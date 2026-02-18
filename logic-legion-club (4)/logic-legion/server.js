require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB Connection ─────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ── Student Schema ─────────────────────────────────────────────────────────────
const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  mobno:      { type: String, required: true, trim: true },
  branch:     { type: String, required: true, trim: true },
  year:       { type: String, required: true, trim: true },
  domain:     { type: String, required: true, trim: true },
  excitement: { type: String, required: true, trim: true },
  registeredAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

// ── API Routes ─────────────────────────────────────────────────────────────────

// Register a student
app.post('/api/register', async (req, res) => {
  try {
    const { name, mobno, branch, year, domain, excitement } = req.body;

    if (!name || !mobno || !branch || !year || !domain || !excitement) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!/^\d{10}$/.test(mobno)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit mobile number.' });
    }

    const existing = await Student.findOne({ mobno });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This mobile number is already registered.' });
    }

    const student = new Student({ name, mobno, branch, year, domain, excitement });
    await student.save();

    res.status(201).json({ success: true, message: 'Registration successful! Welcome to Logic Legion 🚀' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect password.' });
  }
});

// Get all students (admin)
app.get('/api/admin/students', async (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  try {
    const students = await Student.find().sort({ registeredAt: -1 });
    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Delete a student (admin)
app.delete('/api/admin/students/:id', async (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Logic Legion server running on port ${PORT}`));
