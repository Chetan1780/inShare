// models/File.js

const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  cloudinary_Url: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // set expiration
});

const File = mongoose.model('File', FileSchema);

module.exports = File;
