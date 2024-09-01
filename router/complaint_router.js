const express = require('express');
const mongoose = require('mongoose');
const complaintDB = require('../models/complaintschema');
const complaintrouter = express.Router();

// Middleware to validate userId
const validateUserId = (req, res, next) => {
  const userId = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Invalid userId format',
    });
  }
  next();
};

// Route to add a new complaint
complaintrouter.post('/addcomplaint/:userId', validateUserId, async (req, res) => {
  const userId = req.params.userId;
  const { complaint } = req.body;

  // Validate complaint text
  if (!complaint || typeof complaint !== 'string' || complaint.trim() === '') {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Complaint text is required and should be a non-empty string',
    });
  }

  try {
    // Create new complaint
    const complaintEntry = new complaintDB({
      userId: new mongoose.Types.ObjectId(userId),
      complaint,
      date: new Date(),
    });

    // Save to database
    const data = await complaintEntry.save();
    return res.status(201).json({
      success: true,
      error: false,
      data,
      message: 'Complaint added successfully',
    });
  } catch (error) {
    console.error('Error adding complaint:', error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Internal Server Error',
      errorMessage: error.message,
    });
  }
});

// Route to view complaints for a user
complaintrouter.get('/viewcomplaint/:userId', validateUserId, async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch complaints
    const complaints = await complaintDB.find({ userId: new mongoose.Types.ObjectId(userId) });

    if (complaints.length > 0) {
      return res.status(200).json({
        success: true,
        error: false,
        data: complaints,
        message: 'Complaints fetched successfully',
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'No complaints found for this user',
      });
    }
  } catch (error) {
    console.error('Error fetching complaints:', error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Internal Server Error',
      errorMessage: error.message,
    });
  }
});

complaintrouter.get('/viewallcomplaints', async (req, res) => {
  try {
    // Fetch all complaints
    const complaints = await complaintDB.find();

    if (complaints.length > 0) {
      return res.status(200).json({
        success: true,
        error: false,
        data: complaints,
        message: 'All complaints fetched successfully',
      });
    } else {
      return res.status(404).json({
        success: false,
        error: true,
        message: 'No complaints found',
      });
    }
  } catch (error) {
    console.error('Error fetching complaints:', error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: 'Internal Server Error',
      errorMessage: error.message,
    });
  }
});

module.exports = complaintrouter;
