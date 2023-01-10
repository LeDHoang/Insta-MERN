const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers: [{
        type:ObjectId,
        ref:"User"
    }],
    followings: [{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dypitsv20/image/upload/v1673174320/ET0A7897_dsdivi.jpg"
    }
})

mongoose.model("User", userSchema)