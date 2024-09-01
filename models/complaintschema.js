const mongoose = require('mongoose');

const complaintsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'auth',
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  reply: { type: String, default: '...' },
});

const complaintDB = mongoose.model('complaints', complaintsSchema);
module.exports = complaintDB;
