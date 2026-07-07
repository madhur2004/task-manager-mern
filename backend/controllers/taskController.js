const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;

  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required');
  if (title && (title.trim().length < 3 || title.trim().length > 150)) {
    errors.push('Title must be between 3 and 150 characters');
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400);
    return res.json({ success: false, message: 'Validation failed', errors });
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    dueDate,
    priority,
    status,
  });

  res.status(201).json({
    success: true,
    message: 'Task created',
    data: task,
  });
});

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Tasks fetched',
    data: tasks,
  });
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid task id');
  }

  const task = await Task.findById(id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.status(200).json({
    success: true,
    message: 'Task fetched',
    data: task,
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid task id');
  }

  const task = await Task.findById(id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found');
  }

  const { title, description, dueDate, priority, status } = req.body;

  const errors = [];
  if (title !== undefined && (title.trim().length < 3 || title.trim().length > 150)) {
    errors.push('Title must be between 3 and 150 characters');
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400);
    return res.json({ success: false, message: 'Validation failed', errors });
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    message: 'Task updated',
    data: updatedTask,
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid task id');
  }

  const task = await Task.findById(id);

  if (!task || task.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted',
  });
});

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
