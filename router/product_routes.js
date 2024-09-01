const express=require("express");
const productDB = require("../models/productscheme");
const product_routes=express.Router()
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const wishListDB = require("../models/wishlistschema");
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'watch/products',
  },
});
const upload = multer({ storage: storage });

product_routes.post('/addProduct', upload.single('image'), async (req, res) => {
    try {
      const Data = {
        name: req.body.name,
        type: req.body.type,
        brand: req.body.brand,
        price:req.body.price,
        description:req.body.description,
        image:req.file.path
    
       
      };
      const data = await productDB(Data).save();
      if (data) {
        return res.status(201).json({
          Success: true,
          Error: false,
          Message: 'Data added successfully',
          data: data,
        });
      } else {
        return res.status(400).json({
          Error: true,
          Success: false,
          Message: 'Error, Data no added',
        });
      }
    } catch (error) {
      return res.status(400).json({
        Error: true,
        Success: false,
        Message: 'Internal server error',
        ErrorMessage: error,
      });
    }
  });

  product_routes.get('/viewProduct', async (req, res) => {
   await productDB
      .find()
      .then((data) => {
       return res.status(200).json({
          Success: true,
          Error: false,
          data: data,
        });
      })
      .catch((error) => {
        return res.status(400).json({
          Success: false,
          Error: true,
          ErrorMessage: error,
        });
      });
  });

  product_routes.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
  
        const data = await productDB.findByIdAndDelete(id);
  
        if (data) {
            return res.status(200).json({
                Success: true,
                Error: false,
                Message: 'Data deleted successfully',
                data: data,
            });
        } else {
            return res.status(400).json({
                Error: true,
                Success: false,
                Message: 'Error, Data not deleted',
            });
        }
    } catch (error) {
        return res.status(400).json({
            Error: true,
            Success: false,
            Message: 'Internal server error',
            ErrorMessage: error,
        });
    }
  });


  product_routes.put('/updateProduct/:id',upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;

        const oldData = await productDB.findOne({_id:id})
        
        const updatedData = {
          name: req.body.name,
          type: req.body.type,
          brand: req.body.brand,
          price:req.body.price,
          description:req.body.description,
          image:req.file?req.file.path:oldData.image
        };
  
        const data = await productDB.findByIdAndUpdate(id, updatedData, { new: true });
  
        if (data) {
            return res.status(200).json({
                Success: true,
                Error: false,
                Message: 'Data updated successfully',
                data: data,
            });
        } else {
            return res.status(400).json({
                Error: true,
                Success: false,
                Message: 'Error, Data not updated',
            });
        }
    } catch (error) {
      console.log(error)
        return res.status(500).json({
            Error: true,
            Success: false,
            Message: 'Internal server error',
            ErrorMessage: error,
        });
    }
  });

  //***********************************************WISHLIST****************************************************** */
  product_routes.post('/wishlist/addItem', async (req, res) => {
    try {
      const { productId, userId } = req.body;
  
      // Check if the product exists
      const product = await productDB.findById(productId);
      if (!product) {
        return res.status(404).json({
          Success: false,
          Error: true,
          Message: 'Product not found'
        });
      }
  
      // Check if the item is already in the wishlist
      const existingItem = await wishListDB.findOne({ productId, userId });
      if (existingItem) {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Item already in wishlist'
        });
      }
  
      const newItem = new wishListDB({ productId, userId });
      const savedItem = await newItem.save();
  
      res.status(201).json({
        Success: true,
        Error: false,
        Message: 'Item added to wishlist successfully',
        data: savedItem
      });
    } catch (error) {
      res.status(500).json({
        Success: false,
        Error: true,
        Message: 'Failed to add item to wishlist',
        ErrorMessage: error.message
      });
    }
  });
  
  // Remove an item from the wishlist
  product_routes.delete('/wishlist/removeItem/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const removedItem = await wishListDB.findByIdAndDelete(id);
  
      if (removedItem) {
        res.status(200).json({
          Success: true,
          Error: false,
          Message: 'Item removed from wishlist successfully',
          data: removedItem
        });
      } else {
        res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Item not found in wishlist'
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
  
  // Get all wishlist items for a user
  product_routes.get('/wishlist/viewItems/:userId', async (req, res) => {
    console.log('Received request for user:', req.params.userId); // Debugging line
    try {
      const { userId } = req.params;
      const wishItems = await wishListDB.find({ userId }).populate('productId');
  
      res.status(200).json({
        Success: true,
        Error: false,
        Message: 'Wishlist items retrieved successfully',
        data: wishItems
      });
    } catch (error) {
      console.error('Error retrieving wishlist items:', error); // Debugging line
      res.status(500).json({
        Success: false,
        Error: true,
        Message: 'Failed to retrieve wishlist items',
        ErrorMessage: error.message
      });
    }
  });
  

module.exports=product_routes


