import express from 'express'
import userRouter from './user.router.js';
import categoryRouter from './category.route.js';
import subcategory from './subcategory.route.js';
import product from './product.route.js';
import uploadRouter from './upload.route.js';
import cartRouter from './cart.route.js';

const indexRoute = express.Router()


indexRoute.use("/user", userRouter);
indexRoute.use("/category",categoryRouter)
indexRoute.use("/subcategory",subcategory)
indexRoute.use("/product",product)
indexRoute.use("/file" , uploadRouter)
indexRoute.use("/cart",cartRouter)
export default indexRoute