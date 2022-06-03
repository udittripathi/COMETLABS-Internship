const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    role: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    cpassword: {
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    acType: {
        type: String,
        enum: ['ADMIN','IN', 'NGO'],
        default: 'IN'
    }
}, {timestamps: true});


const User = mongoose.model('USER', userSchema);

module.exports = User; 