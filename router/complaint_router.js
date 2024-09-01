const express = require('express');
const complaintDB = require('../models/complaintschema'); 
const complaintrouter = express.Router();

complaintrouter.post('/addcomplaint/:userId', async (req, res) => {
  try {
    const Complaint = {
      userId: req.params.userId,
      complaint: req.body.complaint,
    };
    const Data = await complaintDB(Complaint).save();
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Complaint added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Complaint',
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

complaintrouter.get('/viewcomplaint/:userId', async (req, res) => {
    try {
      const Data = await complaintDB.find({ userId: req.params.userId });
      if (Data) {
        return res.status(201).json({
          Success: true,
          Error: false,
          data: Data,
          Message: 'Complaint fetched successfully',
        });
      } else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Failed fetching Complaint ',
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


  

module.exports = complaintrouter;
