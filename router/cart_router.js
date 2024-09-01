const express = require('express');
const mongoose = require('mongoose');
const productDB = require('../models/productscheme');
const cartDB = require('../models/cartschema');
const cartRouter = express.Router();

// Add item to cart
cartRouter.post('/addItem', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body

    const { productId, quantity, userId } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid User ID');
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Invalid User ID'
      });
    }

    const product = await productDB.findById(productId);
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Product not found'
      });
    }

    const newItem = new cartDB({
      productId: product._id,
      userId: userId,
      quantity: quantity,
    });
    const savedItem = await newItem.save();

    console.log('Response Status Code:', 201);
    res.status(201).json({
      Success: true,
      Error: false,
      Message: 'Item added to cart successfully',
      data: savedItem
    });
  } catch (error) {
    console.error('Failed to add item to cart:', error.message); // Log the error message
    console.log('Response Status Code:', 500);
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Failed to add item to cart',
      ErrorMessage: error.message
    });
  }
});


//******************************************************************************************************************* */

// Update item in cart
cartRouter.put('/updateItem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { quantity: req.body.quantity };

    const updatedItem = await cartDB.findByIdAndUpdate(id, updatedData, { new: true });

    if (updatedItem) {
      res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Item updated successfully',
        data: updatedItem
      });
    } else {
      res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to update item in cart'
      });
    }
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message
    });
  }
});


// Remove item from cart
cartRouter.delete('/removeItem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removedItem = await cartDB.findByIdAndDelete(id);

    if (removedItem) {
      res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Item removed from cart successfully',
        data: removedItem
      });
    } else {
      res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to remove item from cart'
      });
    }
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message
    });
  }
});

// Get all items in cart for a specific user
// Ensure this route is correctly set up in cartRouter
cartRouter.get('/viewCart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await cartDB.find({ userId }).populate('productId');

    res.status(200).json({
      Success: true,
      Error: false,
      Message: 'Cart items retrieved successfully',
      data: cartItems
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Failed to retrieve cart items',
      ErrorMessage: error.message
    });
  }
});


module.exports = cartRouter;
