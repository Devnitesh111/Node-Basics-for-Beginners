const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        // console.log(file)
        const allowedFileTypes = ['image/png','image/jpeg','image/jpg']
        if(!allowedFileTypes.includes(file.mimetype)){
            cb(new Error("This filetype is not supported")) // cb(error)
            return
        }
       
        //callback cb
        cb(null,'./storage')//-->cb(error,success)
},
filename : function(req,file,cb){
    cb(null,Date.now()+"-"+ file.originalname)

}
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb) {
        if (!allowedFileTypes.includes(file.mimetype)) {
            cb(new Error("This filetype is not supported"));
            return;
        }
        cb(null, true);
    }
});

module.exports = {
    // storage : storage,
    // multer : multer
    storage,
    multer 
}