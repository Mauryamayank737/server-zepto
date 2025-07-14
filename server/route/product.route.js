import express from "express"
import { auth } from "../middleware/auth.middleware.js"
// import { addProduct, deletPorduct, filtterProduct, getProduct, list, UpdateProduct, view } from "../controllers/product.controller.js"
import { addProduct, deletPorduct, filtterProduct, getProductByCategory, getProductBySubcategory, list, UpdateProduct, view } from "../controllers/product.controller.js"
const product = express.Router()
product.post("/create",auth,addProduct)
// product.get("/get",getProduct)
product.post("/delete",auth , deletPorduct )
product.post('/update',auth,UpdateProduct)
product.post('/filtter',filtterProduct)
product.get('/view/:id',view)
product.post('/list',list)
product.post('/productBycategory',getProductByCategory)
product.post('/productBySubcategory',getProductBySubcategory)
export default product


// product.post("/create",auth,create)
// product.post("/list",list)
// product.delete("/destroy",auth , destroy )
// product.get('/view/:id',auth,view)
// product.put('/update',auth,update)