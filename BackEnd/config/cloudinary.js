const { v2: cloudinary } = require('cloudinary');
require('dotenv').config();  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_APPNAME, 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_SECRET, 
});
module.exports = cloudinary;