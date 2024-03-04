const mongoose = require("mongoose")


let pl = mongoose.Schema;
const addressdetailsschema = new pl({
    cname: String,
    caddress: String,
    cphone: Number,
    ccount:Number

    
    
});

var addressdetailsmodel = mongoose.model("address", addressdetailsschema)
module.exports = addressdetailsmodel;