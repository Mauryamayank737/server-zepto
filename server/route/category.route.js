import express from 'express'
import {auth} from '../middleware/auth.middleware.js'
import { AddCategoryController } from '../controllers/category.controller.js '
import { DeleteCategoryController, getCategoryController, UpdateCategoryController } from '../controllers/category.controller.js'

const categoryRouter = express.Router()
categoryRouter.post ("/addCategory" ,auth ,AddCategoryController)
categoryRouter.get("/allcategory",getCategoryController)
categoryRouter.put("/updateCategory",auth  ,UpdateCategoryController)
categoryRouter.post("/deleteCategory",auth  ,DeleteCategoryController)

export default categoryRouter