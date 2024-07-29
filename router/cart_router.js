const express = require('express');
const productDB = require('../models/productscheme');
const cartDB = require('../models/cartschema');
const cartRouter = express.Router();

// Add item to cart
cartRouter.post('/addItem', async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    const product = await productDB.findById(productId);
    if (!product) {
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
    res.status(201).json({
      Success: true,
      Error: false,
      Message: 'Item added to cart successfully',
      data: savedItem
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Failed to add item to cart',
      ErrorMessage: error.message
    });
  }
});

// Update item in cart
cartRouter.put('/updateItem/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      quantity: req.body.quantity
    };

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
