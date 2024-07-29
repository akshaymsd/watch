const express = require('express');
const Brand = require('../models/brandscheme');
const brandRouter = express.Router();

brandRouter.post('/', async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    const savedBrand = await newBrand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

brandRouter.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = brandRouter;
