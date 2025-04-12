const express = require('express');
const upload = require('../config/multer')
const {uploadPdf, servePdf}  = require('../Controller/FileController')
const route = express.Router();
route.post('/upload',upload.single('file'),uploadPdf)
route.get('/serve/:id', servePdf);

module.exports = route;