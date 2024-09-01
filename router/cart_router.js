const express = require('express');
const mongoose = require('mongoose');
const productDB = require('../models/productscheme');
const cartDB = require('../models/cartschema');
const OrderDB = require('../models/orderschema');
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


// **********************************************************

// Create a new order
cartRouter.post('/orders', async (req, res) => {
  try {
    const { userId, products, status } = req.body;

    if (!userId || !products || products.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let totalAmount = 0;

    // Check product availability and calculate total amount
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }
      if (item.quantity > product.stock) { // Assuming you have a 'stock' field in Product model
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }
      totalAmount += item.quantity * product.price;
    }

    const newOrder = new OrderDB({
      userId,
      products,
      totalAmount,
      status,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create order', error: err.message });
  }
});

// Get all orders
cartRouter.get('/orders', async (req, res) => {
  try {
    const orders = await OrderDB.find().populate('userId').populate('products.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// Get a specific order by ID
cartRouter.get('/orders/:id', async (req, res) => {
  try {
    const order = await OrderDB.findById(req.params.id).populate('userId').populate('products.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
});

// Update an existing order
cartRouter.put('/orders/:id', async (req, res) => {
  try {
    const { products, status } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let totalAmount = 0;

    // Check product availability and calculate total amount
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
      }
      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }
      totalAmount += item.quantity * product.price;
    }

    const updatedOrder = await OrderDB.findByIdAndUpdate(
      req.params.id,
      { products, totalAmount, status },
      { new: true }
    ).populate('userId').populate('products.productId');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
});

// Delete an order
cartRouter.delete('/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await OrderDB.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete order', error: err.message });
  }
});


module.exports = cartRouter;
