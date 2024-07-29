const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
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
    }
});
var productDB=mongoose.model('Product', productSchema);
module.exports = productDB
