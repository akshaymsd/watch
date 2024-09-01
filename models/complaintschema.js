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
    type: Date,
    default: Date.now,
  },
  reply: {
    type: String,
    default: 'No reply yet',
  },
});

const complaintDB = mongoose.model('complaints', complaintsSchema);
module.exports = complaintDB;
