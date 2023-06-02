const express= require('express')
const multer=require('multer')
const ejs=require('ejs')
const path=require('path')

//set storage engine

const storage=multer.diskStorage({
    destination:'./public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }

})
//initializing upload
 const upload=multer({
    storage:storage,
    limits:{fileSize:1000000}, //setting size of image upload
    fileFilter:function(req,file, cb){
        checkFileType(file, cb)

    }
 }).single('myImage')
//check file type
function checkFileType(file, cb){
    //allowed extensions
    const filetypes=/jpeg|jpg|png|gif/;
    //check extensions
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase())//checking if the file extensions of the allowed images matches the allowed types
    //check mimetype
    const mimetype=filetypes.test(file.mimetype)
    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb('Error :Images only')
    }
}

//initializing app
const app=express();
const port=3002;

//setting ejs

app.set('view engine', 'ejs')

//public folder
app.use(express.static('./public'))


app.get('/', (req, res)=>{
    res.render('index')
})
app.post('/upload', (req, res)=>{
    upload(req,res, (err)=>{
        if(err){
            res.render('index', {
                msg:err
            })
        }
        else{
            if(req.file==undefined){
                res.render('index',{
                    msg:'Error: No file selected'
                })
            }else{
                res.render('index', {
                    msg:'File Uploaded',
                    file:`uploads/${req.file.filename}`

                })
            }
        }
    })
   
})
app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
})