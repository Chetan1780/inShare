const multer = require('multer');
const storage = multer.memoryStorage(); // or multer.diskStorage({...})
const upload = multer({ storage });

module.exports = upload;
