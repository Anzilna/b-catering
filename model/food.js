const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://catering:catering@cluster0.xz4ni0q.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => { console.log("DB connected") })
    .catch(err => console.log(err));

let pl = mongoose.Schema;
const fooddetailsschema = new pl({
    fdid: String,
    fdname: String,
    fdtype: String,
    
    price: Number,
    description: String,
 
    plantphoto:{
        data : Buffer,
        contentType:String,
    },
    status:String
});

var fooddetailsmodel = mongoose.model("Food", fooddetailsschema)
module.exports = fooddetailsmodel;