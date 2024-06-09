const multer=require('multer');

const storage=multer.memoryStorage();

const singleUpload=multer({storage}).single('product_image')

module.exports= singleUpload;