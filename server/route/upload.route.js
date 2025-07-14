import express from 'express'
import { uploadImageController } from '../controllers/uploadImages.controller.js'
import {auth} from '../middleware/auth.middleware.js'
import { upload } from '../middleware/multer.js'

 const uploadRouter  = express.Router()

uploadRouter.post('/upload' ,auth,upload.single("image") ,uploadImageController)
export default uploadRouter