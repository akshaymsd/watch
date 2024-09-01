const express=require("express");
const productDB = require("../models/productscheme");
const product_routes=express.Router()
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const wishListDB = require("../models/wishlistschema");
const CategoryDB = require("../models/categoryschema");
const exploreDB = require("../models/exploreschema");
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
        brief:req.body.brief,
        description:req.body.description,
        image:req.file.path,
        offer:req.body.offer,
        offerprice:req.body.offerprice,
        sale:req.body.sale,
    
       
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

  // *****************************************<<<<<<<category>>>>>>***************************************************************************
  
// add category

product_routes.post('/category/add', upload.single('image'),async(req,res)=>{
  try{
    const newCategory = new CategoryDB({
      image:req.file.path,
      categoryname:req.body.categoryname
    });
    const savedCategory=await newCategory.save();
    res.status(201).json(savedCategory);
  }catch(errr){
    res.status(400).json({message:errr.message});
  }
});

// view all category

product_routes.get('/category/view', async (req, res) => {
  try {
    const categories = await CategoryDB.find();
    res.json(categories);  // Use `res.json` to send the response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// view one item

product_routes.get('/category/view/:id', async (req, res) => {
  try {
      const category = await CategoryDB.findById(req.params.id);
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json(category);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// update category

product_routes.put('/category/update/:id', upload.single('image'), async (req, res) => {
  try {
    // Find the old category data using the ID from the request parameters
    const oldcategoryData = await CategoryDB.findOne({ _id: req.params.id });

    // If the category is not found, return a 404 error
    if (!oldcategoryData) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update the category data with the new values or keep the old values if not provided
    const updatedCategory = await CategoryDB.findByIdAndUpdate(
      req.params.id,
      {
        image: req.file ? req.file.path : oldcategoryData.image,
        categoryname: req.body.categoryname || oldcategoryData.categoryname
      },
      { new: true } // To return the updated document
    );

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// delete category

product_routes.delete('/category/delete/:id', async (req, res) => {
  try {
      const deletedCategory = await CategoryDB.findByIdAndDelete(req.params.id);
      if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
      res.json({ message: 'Category deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// ******************************<<<<<Explore>>>>>>*********************************************


product_routes.post('/explore/add', upload.single('image'), async (req, res) => {
  try {
      const newProduct = new exploreDB({
          name: req.body.name,
          type: req.body.type,
          brand: req.body.brand,
          brief: req.body.brief,
          price: req.body.price,
          offerprice: req.body.offerprice,
          offer: req.body.offer,
          image: req.file ? req.file.path : null,
          description: req.body.description
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// view

product_routes.get('/explore/view', async (req, res) => {
  try {
      const products = await exploreDB.find();
      res.json(products);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// view by id

product_routes.get('/explore/view/:id', async (req, res) => {
  try {
      const product = await exploreDB.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// update

product_routes.put('/explore/update/:id', upload.single('image'), async (req, res) => {
  try {
      const oldProductData = await exploreDB.findById(req.params.id);

      if (!oldProductData) return res.status(404).json({ message: 'Product not found' });

      const updatedProduct = await exploreDB.findByIdAndUpdate(
          req.params.id,
          {
              name: req.body.name || oldProductData.name,
              type: req.body.type || oldProductData.type,
              brand: req.body.brand || oldProductData.brand,
              brief: req.body.brief || oldProductData.brief,
              price: req.body.price || oldProductData.price,
              offerprice: req.body.offerprice || oldProductData.offerprice,
              offer: req.body.offer || oldProductData.offer,
              image: req.file ? req.file.path : oldProductData.image,
              description: req.body.description || oldProductData.description
          },
          { new: true } // To return the updated document
      );

      res.json(updatedProduct);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// delete

product_routes.delete('/explore/delete/:id', async (req, res) => {
  try {
      const deletedProduct = await exploreDB.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      res.json({ message: 'Product deleted' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});








module.exports=product_routes


