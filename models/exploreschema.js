const mongoose = require('mongoose');

const exploreSchema = new mongoose.Schema({
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
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    offerprice: {
        type: Number, 
        required: true
    },
    offer: {
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
var exploreDB=mongoose.model('explore', exploreSchema);
module.exports = exploreDB
