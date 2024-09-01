const express = require('express');
const complaintDB = require('../models/complaintschema');
const replyRouter = express.Router();

// Route to add a reply to a complaint
replyRouter.post('/reply/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { reply } = req.body;

    // Validate input
    if (!complaintId || !reply) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Complaint ID and reply text are required',
      });
    }

    // Find the complaint and update the reply
    const updatedComplaint = await complaintDB.findByIdAndUpdate(
      complaintId,
      { reply },
      { new: true }
    );

    if (updatedComplaint) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: updatedComplaint,
        Message: 'Reply added successfully',
      });
    } else {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Complaint not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

// Route to view replies for a specific complaint
replyRouter.get('/viewreply/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;

    // Validate input
    if (!complaintId) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Complaint ID is required',
      });
    }

    // Find the complaint
    const complaint = await complaintDB.findById(complaintId);

    if (complaint) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: complaint,
        Message: 'Complaint fetched successfully',
      });
    } else {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Complaint not found',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

module.exports = replyRouter;
