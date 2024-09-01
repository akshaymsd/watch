const mongoose=require("mongoose");
const brandSchema=new mongoose.Schema({
    image:{
        type: String, 
        required: false 
    },
    categoryname:{
        type: String,
        required:true,
    }
});
var CategoryDB=mongoose.model('category',brandSchema);
module.exports=CategoryDB