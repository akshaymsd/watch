const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'auth',
    required: true
  },
 
  status: {
    type: String,
    default:"pending"
  },
  
  quantity: {
    type: Number,
    required: true
  },
  
});

const cartDB = mongoose.model('Cart', cartSchema);
module.exports = cartDB;
