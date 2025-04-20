const multer = require('multer');
const storage = multer.memoryStorage(); // or multer.diskStorage({...})
const upload = multer({ storage,
    limits: { fileSize: 100 * 1024 * 1024 }
 });

module.exports = upload;
