const upload = require("../config/multer")
const cloudinary = require('../config/cloudinary');
const DatauriParser = require('datauri/parser');
const path = require('path');
const File = require('../model/File'); 
const parser = new DatauriParser();
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const axios = require('axios');

const uploadPdf = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const ext = path.extname(req.file.originalname); 
      const dataUri = parser.format(ext, req.file.buffer);
  
      const result = await cloudinary.uploader.upload(dataUri.content, {
        resource_type: 'auto', 
        folder: 'pdfs'        
      });
      const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const file = new File({
        cloudinary_Url: result.secure_url,
        expiresAt: expiresAt
      });
      
      const savedFile = await file.save();
      
      
      return res.status(200).json({
        message: 'PDF uploaded successfully',
        id: savedFile._id
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
const servePdf = async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
  
      if (!file || new Date() > new Date(file.expiresAt)) {
        return res.status(404).json({ message: 'File expired or not found' });
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
      res.status(500).json({ message: 'Failed to serve PDF' });
    }
  };
  
  
module.exports = {uploadPdf,servePdf}