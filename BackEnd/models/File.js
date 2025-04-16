// models/File.js

const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  fileOriginalName:{type:String,required:true},
  cloudinary_Url: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // set expiration
  owner: {type: mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});

const File = mongoose.model('File', FileSchema);

module.exports = File;
