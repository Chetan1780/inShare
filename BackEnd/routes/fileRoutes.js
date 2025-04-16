const express = require('express');
const upload = require('../config/multer')
const {uploadPdf, servePdf,getLinks}  = require('../Controller/FileController')
const authenticate = require('../Middleware/authenticate');
const route = express.Router();
route.get('/serve/:id',servePdf);
route.post('/upload',authenticate,upload.single('file'),uploadPdf)
route.get('/active_links/:id',authenticate,getLinks);

module.exports = route;