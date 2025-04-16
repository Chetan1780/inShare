const upload = require("../config/multer")
const cloudinary = require('../config/cloudinary');
const File = require('../models/File'); 
const handleError = require('../Helper/handleError')

const DatauriParser = require('datauri/parser');
const path = require('path');
const axios = require('axios');

const parser = new DatauriParser();

const uploadPdf = async (req, res,next) => {
    try {
      
      
      if (!req.file) {
        next(handleError(400,'No file uploaded!!'));
      }
  
      const ext = path.extname(req.file.originalname); 
      const dataUri = parser.format(ext, req.file.buffer);
  
      const result = await cloudinary.uploader.upload(dataUri.content, {
        resource_type: 'auto', 
        folder: 'pdfs'        
      });
      destroyMediaAfter24Hours(result.public_id)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const file = new File({
        fileOriginalName:req.file.originalname,
        cloudinary_Url: result.secure_url,
        expiresAt: expiresAt,
        owner:req.user.id
      });
      
      const savedFile = await file.save();
      
      
      return res.status(200).json({
        message: 'PDF uploaded successfully',
        id: savedFile._id
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      next(handleError(500,'Something went wrong!!'));
    }
  };
const servePdf = async (req, res,next) => {
    try {
      const file = await File.findById(req.params.id);
  
      if (!file || new Date() > new Date(file.expiresAt)) {
        next(handleError(404,'file expire or not found!!'));
      }
  
      const cloudinaryUrl = file.cloudinary_Url;
  
      const response = await axios({
        method: 'GET',
        url: cloudinaryUrl,
        responseType: 'stream'
      });
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="file.pdf"');
  
      response.data.pipe(res);
    } catch (err) {
      console.error(err);
      next(handleError(500,'Failed to serve PDF!!'));
    }
  };


  const getLinks = async (req,res,next)=>{
    try {
      const id = req.params.id;
      const file = await File.find({owner:id});
      res.status(200).json({
        success:true,
        file,
        name:req.user.name
      })
    } catch (error) {
      next(handleError(500,error.message));
    }
  }
  
  const destroyMediaAfter24Hours = (publicId) => {
    const delay = 24 * 60 * 60 * 1000;
    console.log(`Scheduled task to delete media with publicId: ${publicId} is triggered`);
    setTimeout(() => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Error destroying media:', error);
        } else {
          console.log('Media successfully destroyed:', result);
        }
      });
    }, delay);
  };
  
module.exports = {uploadPdf,servePdf,getLinks}