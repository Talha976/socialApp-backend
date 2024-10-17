const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'F:/uploads') 
    },
    filename : function (req, file, cb){
        cb(null, Date.now()+ path.extname(file.originalname))
    }
})

const upload  = multer({storage:storage}).single('bgImage')

const uploadBgImage = async (req,res)=>{
    try {
        const userID = req.userID
        const bgImage = req.file.path
        const newBgImage = new BackgroundImage({bgImage:bgImage, user: userID})
        const saveBg = newBgImage.save()
        if(!saveBg){
            return res.status(401).json({message: 'Error Uploading'})
        }
        return res.status(201).json({message: 'Image Uploaded Successfully'})
    } catch (error) {
        return res.status(401).json({message: 'Internal Server Error'})
    }
}

module.exports = {upload, uploadBgImage}