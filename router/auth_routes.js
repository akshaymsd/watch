const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const authDB = require('../models/authscheme');
const AddressDB = require('../models/adrressschema');
 

authRouter .post('/', async (req, res) => {
  try {
    console.log('hi');
    const oldUser = await  authDB.findOne({ username: req.body.username });
    if (oldUser) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Username already exist, Please Log In',
      });
    }
    const oldPhone = await authDB.findOne({ phone: req.body.phone });
    if (oldPhone) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Phone already exist',
      });
    }
    const oldEmail = await authDB.findOne({ email: req.body.email });
    if (oldEmail) {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Email already exist',
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);


  
    let reg = {
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
  	  
    };
    const result = await authDB(reg).save();


    if (result) {
      return res.json({
        Success: true,
        Error: false,
        data: result,
        Message: 'Registration Successful',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Registration Failed',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
    });
  }
});


authRouter.post('/login', async (req, res) => {
  try {
    if (req.body.username && req.body.password) {
      // Find user by username
      const oldUser = await authDB.findOne({
        username: req.body.username,
      });

      if (!oldUser) {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Register First',
        });
      }

      // Compare the password
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        oldUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          Success: false,
          Error: true,
          Message: 'Password Incorrect',
        });
      } else {
        // Return user data on successful login
        return res.status(200).json({
          success: true,
          error: false,
          message: 'Login Successful',
          data: {
            _id: oldUser._id,
            username: oldUser.username,
            name: oldUser.name,
            email: oldUser.email,
            phone: oldUser.phone,
            __v: oldUser.__v,
          },
        });
      }
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'All fields are required',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
});

// address.........................

authRouter.post('/address/add', async (req, res) => {
  try {
    const address = new AddressDB(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// view address


authRouter.get('/address/view/:userId', async (req, res) => {
  try {
    const addresses = await AddressDB.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// view Address

authRouter.get('/address/:id', async (req, res) => {
  try {
    const address = await AddressDB.findById(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update

authRouter.put('/address/update/:id', async (req, res) => {
  try {
    const address = await AddressDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete

authRouter.delete('/address/delete/:id', async (req, res) => {
  try {
    const address = await AddressDB.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
  
  module.exports = authRouter ;
    
