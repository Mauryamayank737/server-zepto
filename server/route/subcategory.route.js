import express from 'express'
import { addSubCategory, allSubCategory, deleteSubCategory, getSuncategoryListUsingCategoryId, updateSubCategory } from '../controllers/subCategory.controller.js'
import { auth } from '../middleware/auth.middleware.js'

const subcategory = express.Router()
subcategory.post("/post",auth ,addSubCategory)
subcategory.get('/get',allSubCategory)
subcategory.post('/delete',auth ,deleteSubCategory)
subcategory.put('/update' ,auth ,updateSubCategory)
subcategory.post('/subCategoryByCategory',getSuncategoryListUsingCategoryId)
export default subcategory