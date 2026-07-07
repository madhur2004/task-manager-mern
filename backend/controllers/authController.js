const asyncHandler = require('express-async-handler');
const validator = require('validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required');
  if (!email || !email.trim()) errors.push('Email is required');
  if (email && !validator.isEmail(email)) errors.push('Please provide a valid email address');
  if (!password) errors.push('Password is required');
  if (password && password.length < 6) errors.push('Password must be at least 6 characters');

  if (errors.length > 0) {
    res.status(400);
    return res.json({ success: false, message: 'Validation failed', errors });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const errors = [];
  if (!email || !email.trim()) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    res.status(400);
    return res.json({ success: false, message: 'Validation failed', errors });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: req.user,
  });
});

module.exports = { registerUser, loginUser, getMe };
