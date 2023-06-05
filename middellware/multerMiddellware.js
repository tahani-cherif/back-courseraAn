const multer=require('multer')
const path=require('path')


exports.upload=(folder)=>multer({
    storage:multer.diskStorage({
        destination:folder,
        filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
        }
    })
    
})