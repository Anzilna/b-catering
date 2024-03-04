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


const adminlogins=mongoose.model("adminlogins",newSchema)


module.exports=adminlogins

