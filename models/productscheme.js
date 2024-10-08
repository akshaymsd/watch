const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        required: false
    },
    price: {
        type: Number, 
        required: true
    },
    image: {
        type: String, 
        required: false 
    },
    description: {
        type: String,
        required: false 
    },
    offerprice: {
        type: Number, 
        required: false
    },
    offer: {
        type: Number, 
        required: false
    },
    sale: {
        type: String, 
        required: false
    },
});
var productDB=mongoose.model('Product', productSchema);
module.exports = productDB
