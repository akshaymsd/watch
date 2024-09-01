// routes/review.js
const express = require('express');
const ReviewDB = require('../models/reviewschema');
const review_router = express.Router();

// Add a review
review_router.post('/add', async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    
    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new ReviewDB({
      productId,
      userId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get reviews for a product
review_router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewDB.find({ productId }).populate('userId', 'username');
    
    if (!reviews) {
      return res.status(404).json({ message: 'No reviews found for this product' });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a review
review_router.delete('/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await ReviewDB.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = review_router;
