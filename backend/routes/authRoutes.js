const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, course } = req.body;

        // Check if user exists
        let student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new student
        student = new Student({
            name,
            email,
            password,
            course
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);

        await student.save();

        // Create JWT
        const payload = {
            user: {
                id: student.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: student.id, name: student.name, email: student.email, course: student.course } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/login
// @desc    Authenticate student and return JWT token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        let student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT
        const payload = {
            user: {
                id: student.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: student.id, name: student.name, email: student.email, course: student.course } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/me
// @desc    Get logged in user details
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/update-password
// @desc    Update password (verify old password)
// @access  Private
router.put('/update-password', authMiddleware, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        let student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);

        await student.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/update-course
// @desc    Change course
// @access  Private
router.put('/update-course', authMiddleware, async (req, res) => {
    try {
        const { course } = req.body;

        let student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ message: 'User not found' });
        }

        student.course = course;
        await student.save();

        res.json({ message: 'Course updated successfully', course: student.course });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
