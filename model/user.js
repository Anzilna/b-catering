const mongoose = require("mongoose")

const newSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


const userlogins=mongoose.model("userlogins",newSchema)


module.exports=userlogins

