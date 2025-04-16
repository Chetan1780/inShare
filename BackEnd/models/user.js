const monoose = require('mongoose');
const userSchema = new monoose.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true},
    password:{type:String,required:true}
},{timestamps:true})
const User = monoose.model('User',userSchema,'users');
module.exports = User;