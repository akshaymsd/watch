const express = require('express');
const mongoose = require('mongoose');
 const authRouter = require('./router/auth_routes');
const brandRouter = require('./router/brand_routes');
const productRouter = require('./router/product_routes');
const product_routes = require('./router/product_routes');
const cartRouter = require('./router/cart_router');
require('dotenv').config();


const app = express();


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log("Database connected")
})
.catch((error)=>{                      
  console.log(error)

})

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
  res.send("hello")
});
app.use('/api/auth',authRouter);
app.use('/api/brands',brandRouter);
app.use('/api/products',product_routes);
app.use('/api/cart', cartRouter);

 

app.listen(process.env.PORT, () => {
  console.log('Server Started');
});
