const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require("mongoose");
const { required } = require('joi');

const userSchema = new mongoose.Schema({ //accepts a object
    email:{
        type:String , 
        trim:true,
        required:true
    },
    role:{
        type:String,
        enum:['admin','customer'],
        default:'customer'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

userSchema.plugin(passportLocalMongoose); //To bring all the strategies and methods which passport-local-mongoose uses bts .

let User = mongoose.model('User' , userSchema) ;
module.exports = User ;