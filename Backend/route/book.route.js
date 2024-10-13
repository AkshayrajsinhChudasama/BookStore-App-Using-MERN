
import express from "express";
import { getBook ,createBook, deleteBook} from "../controller/book.controller.js";
import multer from 'multer';
const router = express.Router();
import path from 'path';

// Set up storage with custom filename
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'./uploads');
    },
    filename:function (req,file,cb){
        let ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, path.basename(file.originalname,ext)+'-'+uniqueSuffix+ext)
    }
})
export const upload = multer({storage:storage});

router.get("/getbook", getBook);
router.post('/createbook', upload.fields([{ name: 'imageFile' }, { name: 'bookFile' }]), createBook);
router.post('/deleteBook',deleteBook);
export default router;