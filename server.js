const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./router/auth_routes');
const brandRouter = require('./router/brand_routes');
const cartRouter = require('./router/cart_router');
const product_routes = require('./router/product_routes');
const complaintrouter = require('./router/complaint_router');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error:", error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send("hello");
});

app.use('/api/auth', authRouter);
app.use('/api/brands', brandRouter);
app.use('/api/products', product_routes);
app.use('/api/cart', cartRouter);
app.use('/api/complaints', complaintrouter); // Use the correct router

app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});
