const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcryptjs');
const authDB = require('../models/authscheme');
 

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


authRouter .post('/login', async (req, res) => {
    try {
      if (req.body.username && req.body.password) {
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
        }else{
  
  
        return res.status(200).json({
          success: true,
          error: false,
          message: 'Login Succesful'
         });
  }
      } else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'All field are required',
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

  
  module.exports = authRouter ;
    
